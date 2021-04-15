﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace TimeTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        MainDb database;
        AuthHelper authHelper;

        public ProjectController(MainDb db, AuthHelper auth)
        {
            database = db;
            authHelper = auth;
        }

        /// <summary>
        /// Gets a project by a specific project id
        /// </summary>
        /// <param name="id">The Id of the project you want the data for</param>
        /// <returns>All the information about a project</returns>
        [Authorize]
        [HttpGet("{id}")]
        public async Task<GenericResponseDTO<Project>> GetProjectById(int id)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            // Only return the project if we are associated with it
            var project = await database.Projects
                .AsNoTracking()
                .Where(x => 
                    x.Teacher.Id == currentUserId || 
                    x.Students.Any(x => x.Id == currentUserId))
                .Include(x => x.Teacher)
                .Include(x => x.Students)
                .Include(x => x.Tags)
                .FirstOrDefaultAsync(x => x.Id == id);

            return new GenericResponseDTO<Project>() 
            { 
                Data = project,
                Success = true
            };
        }

        /// <summary>
        /// Gets all the active projects a user is associated with
        /// </summary>
        /// <returns>A list of all the active projects the user is the teacher or is a student of</returns>
        [Authorize]
        [HttpGet("Active")]
        public async Task<GenericResponseDTO<List<Project>>> GetActiveProjectsByUser()
        {
            var currentUserId = authHelper.GetCurrentUserId(User);
            var projects = new List<Project>();

            // Only (active) projects we teach or are a student of
            projects = await database.Projects
                  .AsNoTracking()
                  .Where(x => (x.Teacher.Id == currentUserId || x.Students.Any(x => x.Id == currentUserId)) && x.ArchivedDate == null)
                  .Include(x => x.Teacher)
                  .Include(x => x.Students)
                  .Include(x => x.Tags)
                  .ToListAsync();

            return new GenericResponseDTO<List<Project>>()
            {
                Data = projects,
                Success = true
            };
        }

        /// <summary>
        /// Gets all the archived projects a user is associated with
        /// </summary>
        /// <returns>A list of all the archived projects the user is the teacher or is a student of</returns>
        [Authorize]
        [HttpGet("Archived")]
        public async Task<GenericResponseDTO<List<Project>>> GetArchivedProjectsByUser()
        {
            var currentUserId = authHelper.GetCurrentUserId(User);
            var projects = new List<Project>();

            // Only (archived) projects we teach or are a student of
            projects = await database.Projects
                  .AsNoTracking()
                  .Where(x => (x.Teacher.Id == currentUserId || x.Students.Any(x => x.Id == currentUserId)) && x.ArchivedDate != null)
                  .Include(x => x.Teacher)
                  .Include(x => x.Students)
                  .Include(x => x.Tags)
                  .ToListAsync();

            return new GenericResponseDTO<List<Project>>()
            {
                Data = projects,
                Success = true
            };
        }

        [Authorize]
        [HttpPost("Tags")]
        public async Task<GenericResponseDTO<bool>> SetTags(List<CreateTagDTO> tags){
            var currentUserId = authHelper.GetCurrentUserId(User);

            // Only allow the teacher to tag a project
            var project = await database.Projects
                .Include(x => x.Tags)
                .FirstAsync(x => x.Id == tags.First().ProjectId && x.Teacher.Id == currentUserId && x.ArchivedDate == null);
            
            if (project == null)
            {
                return new GenericResponseDTO<bool>()
                {
                    Message = "Couldn't find the project",
                    Success = false
                };
            }

            project.Tags = new List<Tag>();

            foreach(var newTag in tags){
                var tag = new Tag()
                {
                    Name = newTag.Tag,
                    Project = project
                };
                
                project.Tags.Add(tag);
            }
            
            await database.SaveChangesAsync();

            return new GenericResponseDTO<bool>()
            {
                Data = true,
                Success = true
            };
        }

        /// <summary>
        /// Add a tag to a project
        /// </summary>
        /// <param name="newTag">The Id of a project to tag as well as the tag you want to add</param>
        /// <returns>The Id of the newly created tag</returns>
        [Authorize]
        [HttpPost("Tag")]
        public async Task<GenericResponseDTO<int>> AddTag(CreateTagDTO newTag)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            // Only allow the teacher to tag a project
            var project = await database.Projects
                .AsQueryable()
                .FirstAsync(x => x.Id == newTag.ProjectId && x.Teacher.Id == currentUserId && x.ArchivedDate == null);
            
            if (project == null)
            {
                return new GenericResponseDTO<int>()
                {
                    Message = "Couldn't find the project",
                    Success = false
                };
            }

            var tag = new Tag()
            {
                Name = newTag.Tag,
                Project = project
            };

            await database.AddAsync(tag);
            await database.SaveChangesAsync();

            return new GenericResponseDTO<int>()
            {
                Data = tag.Id,
                Success = true
            };
        }

        /// <summary>
        /// Adds a user to a project
        /// </summary>
        /// <param name="projectInvite">The invite code of the project that the user is added to</param>
        /// <returns>The Id of the project the user was added to</returns>
        [Authorize]
        [HttpPost("AddUserToProject")]
        public async Task<GenericResponseDTO<int>> AddUserToProject(AddUserToProjectDTO inviteCode)
        {
            var curUser = await database.Users
                .Include(x => x.Projects)
                .FirstOrDefaultAsync(x => x.Id == authHelper.GetCurrentUserId(User));

            Project project = await database.Projects
                .AsQueryable()
                .FirstOrDefaultAsync(x => x.InviteCode == inviteCode.InviteCode);

            if (project == null)
            {
                return new GenericResponseDTO<int>()
                {
                    Message = "Couldn't find the project",
                    Success = false
                };
            }

            if (project.ArchivedDate != null)
            {
                return new GenericResponseDTO<int>()
                {
                    Message = "Can't add user to archived project",
                    Success = false
                };
            }

            if(curUser.Projects.Contains(project))
            {
                return new GenericResponseDTO<int>()
                {
                    Message = "User is already assigned to this project",
                    Success = false
                };
            } else {
                curUser.Projects.Add(project);
            }
            
            await database.SaveChangesAsync();

            return new GenericResponseDTO<int>()
            {
                Data = project.Id,
                Success = true
            };
        }

        /// <summary>
        /// Create a new project
        /// </summary>
        /// <param name="newProject">The details of the new project to create</param>
        /// <returns>The Id of the project that was created</returns>
        [Authorize]
        [HttpPost]
        public async Task<GenericResponseDTO<int>> CreateProject(ProjectCreateDTO newProject)
        {
            var currentUser = await authHelper.GetCurrentUser(User, database);

            var response = new GenericResponseDTO<int>() 
            { 
                Success = false
            };

            // Project validation
            if (string.IsNullOrWhiteSpace(newProject.ClientName))
            {
                response.Message = "A project must have a client name.";
                return response;
            }

            if (string.IsNullOrWhiteSpace(newProject.ProjectName))
            {
                response.Message = "A project must have a project name.";
                return response;
            }

            // Create the tags
            var tags = new List<Tag>();
            if(newProject.Tags != null) {
                newProject.Tags.ForEach(x => tags.Add(new Tag() 
                {
                    Name = x
                }));
            }

            // Create the new project object
            var project = new Project()
            {
                ClientName = newProject.ClientName,
                Description = newProject.Description,
                CreatedTime = DateTime.UtcNow,
                Name = newProject.ProjectName,
                Teacher = currentUser,
                InviteCode = Guid.NewGuid().ToString(),
                Tags = tags,
                Students = new List<User>()
            };

            await database.AddAsync(project);
            await database.SaveChangesAsync();

            response.Success = true;
            response.Data = project.Id;

            return response;
        }

        /// <summary>
        /// Update project details
        /// </summary>
        /// <param name="projectDetails">The details of the existing project to update</param>
        /// <returns>The Id of the project that was updated</returns>
        [Authorize]
        [HttpPatch]
        public async Task<GenericResponseDTO<int>> UpdateProjectDetails(ProjectDetailsDTO projectDetails)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            var response = new GenericResponseDTO<int>() 
            { 
                Success = false
            };

            Project project = await database.Projects
                .AsQueryable()
                .FirstOrDefaultAsync(x => x.Id == projectDetails.ProjectId && x.Teacher.Id == currentUserId && x.ArchivedDate == null);

            if (project == null)
            {
                return new GenericResponseDTO<int>()
                {
                    Message = "Couldn't find the project",
                    Success = false
                };
            }

            project.Description = projectDetails.Description;

            await database.SaveChangesAsync();

            response.Success = true;
            response.Data = project.Id;

            return response;
        }

        /// <summary>
        /// This endpoint is used to archive or unarchive a project.
        /// </summary>
        /// <param name="archiveDetails">The project Id and if the project is being archived or not</param>
        /// <returns>The archive date that was saved in the database, returns null if it was unarchived.</returns>
        [Authorize]
        [HttpPost("Archive")]
        public async Task<GenericResponseDTO<DateTime?>> ArchiveProject(ArchiveProjectDTO archiveDetails)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            var response = new GenericResponseDTO<DateTime?>()
            {
                Success = true
            };

            Project archivingProject = await database.Projects
                .AsQueryable()
                .Where(x => x.Id == archiveDetails.ProjectId)
                .Where(x => x.Teacher.Id == currentUserId)
                .FirstOrDefaultAsync();
            
            if(archivingProject == null)
            {
                response.Success = false;
                response.Message = "Could not find the project";
                return response;
            }

            if (archiveDetails.Archive)
            {
                archivingProject.ArchivedDate = DateTime.UtcNow;
            }
            else
            {
                archivingProject.ArchivedDate = null;
            }

            await database.SaveChangesAsync();

            response.Data = archivingProject.ArchivedDate;
            return response;
        }
    }
}
