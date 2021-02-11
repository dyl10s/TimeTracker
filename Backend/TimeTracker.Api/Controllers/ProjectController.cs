﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;

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

        [Authorize]
        [HttpGet]
        public async Task<GenericResponseDTO<List<Project>>> GetProjectsByUser()
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            // Get all the projects we teach or are a student of
            var projects = await database.Projects
                .AsNoTracking()
                .Where(x => x.Teacher.Id == currentUserId || x.Students.Any(x => x.Id == currentUserId))
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
            newProject.Tags.ForEach(x => tags.Add(new Tag() 
            {
                Name = x
            }));

            // Create the new project object
            var project = new Project()
            {
                ClientName = newProject.ClientName,
                Description = newProject.Description,
                CreatedTime = DateTime.UtcNow,
                Name = newProject.ProjectName,
                Teacher = currentUser,
                InviteCode = Guid.NewGuid().ToString(),
                Tags = tags
            };

            await database.AddAsync(project);
            await database.SaveChangesAsync();

            response.Success = true;
            response.Data = project.Id;

            return response;
        }
    }
}
