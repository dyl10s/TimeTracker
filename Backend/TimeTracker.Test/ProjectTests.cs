﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Database.Models;
using TimeTracker.Test.Helpers;

namespace TimeTracker.Test
{
    [TestClass]
    public class ProjectTests : BaseTest
    {
        ProjectController projectController;
        AuthController authController;

        public ProjectTests()
        {
            projectController = new ProjectController(database, new AuthHelper());
            authController = new AuthController(database, configuration, new AuthHelper());
            
            TestAuthHelpers.LogInUser(database, configuration, projectController).GetAwaiter().GetResult(); 
        }

        [TestMethod]
        public async Task CreateProject()
        {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Test Client",
                Description = "Test Description",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "Test Tag 1",
                    "Test Tag 2"
                }
            });

            Assert.IsTrue(createResult.Success);

            var allProjects = await projectController.GetActiveProjectsByUser();

            Assert.IsTrue(allProjects.Success);
            Assert.AreEqual(allProjects.Data.Count, 1);

            Assert.AreEqual(allProjects.Data[0].ClientName, "Test Client");
            Assert.AreEqual(allProjects.Data[0].Description, "Test Description");
            Assert.AreEqual(allProjects.Data[0].Name, "Test Name");

            Assert.AreEqual(allProjects.Data[0].Tags.Count, 2);

            var newTag = await projectController.AddTag(new CreateTagDTO() 
            {
                ProjectId = allProjects.Data[0].Id, 
                Tag = "New Tag"
            });

            var projectById = await projectController.GetProjectById(allProjects.Data[0].Id);

            Assert.IsTrue(projectById.Success);

            Assert.AreEqual(projectById.Data.ClientName, "Test Client");
            Assert.AreEqual(projectById.Data.Description, "Test Description");
            Assert.AreEqual(projectById.Data.Name, "Test Name");

            Assert.AreEqual(projectById.Data.Tags.Count, 3);
            Assert.IsTrue(projectById.Data.Tags.Any(x => x.Name == "New Tag"));
        }


        [TestMethod]
        public async Task UpdateProjectDetails() {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Test Client",
                Description = "Test Description",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "Test Tag 1",
                    "Test Tag 2"
                }
            });

            Assert.IsTrue(createResult.Success);

            var project = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(project.Data.Description == "Test Description");

            await projectController.UpdateProjectDetails(new ProjectDetailsDTO()
            {
                Description = "Updated Description",
                ProjectId = createResult.Data
            });

            var projectUpdated = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(projectUpdated.Data.Description == "Updated Description");
        }
        
        [TestMethod]
        public async Task AddUserToProject()
        {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Test Client",
                Description = "Test Description",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "Test Tag 1",
                    "Test Tag 2"
                }
            });

            Assert.IsTrue(createResult.Success);

            var project = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(project.Data.Description == "Test Description");

            await projectController.UpdateProjectDetails(new ProjectDetailsDTO()
            {
                Description = "Updated Description",
                ProjectId = createResult.Data
            });

            var projectUpdated = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(projectUpdated.Data.Description == "Updated Description");
            await projectController.AddUserToProject(new AddUserToProjectDTO(){
                InviteCode = project.Data.InviteCode
            });

            var userProjects = await projectController.GetActiveProjectsByUser();

            Assert.IsTrue(userProjects.Data.Count == 1);
            Assert.IsTrue(userProjects.Data[0].Id == project.Data.Id);
        }

        [TestMethod]
        public async Task RemoveUserFromProject()
        {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Test Client",
                Description = "Test Description",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "Test Tag 1",
                    "Test Tag 2"
                }
            });

            Assert.IsTrue(createResult.Success);

            var project = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(project.Data.Description == "Test Description");

            await projectController.UpdateProjectDetails(new ProjectDetailsDTO()
            {
                Description = "Updated Description",
                ProjectId = createResult.Data
            });

            var projectUpdated = await projectController.GetProjectById(createResult.Data);

            Assert.IsTrue(projectUpdated.Data.Description == "Updated Description");

            await projectController.AddUserToProject(new AddUserToProjectDTO()
            {
                InviteCode = project.Data.InviteCode
            });
            var userProjects = await projectController.GetActiveProjectsByUser();
            Assert.IsTrue(userProjects.Data.Count == 1);
            Assert.IsTrue(userProjects.Data[0].Id == project.Data.Id);

            // Testing to attempt to remove teacher //
            await projectController.RemoveUserFromProject(new ProjectRemoveUserDTO()
            {
                ProjectId = 1,
                UserId = 1
            });
            Assert.IsTrue(userProjects.Data.Count == 1);
            Assert.IsTrue(userProjects.Data[0].Id == 1);

            // Testing to attempt to remove student //
            var student = await authController.Register(new UserDTO(){
                Email = "newStudent12345@gmail.com",
                Password = "Admin123.",
                FirstName = "New",
                LastName = "Student",
                InviteCode = project.Data.InviteCode
            });

            Console.WriteLine(project.Data.Students.Count);
            Assert.IsTrue(project.Data.Students.Count == 1);
            Assert.IsTrue(project.Data.Id == 1);
            await projectController.RemoveUserFromProject(new ProjectRemoveUserDTO()
            {
                ProjectId = 1,
                UserId = 2
            });
            Assert.IsTrue(project.Data.Students.Count == 0);
        }

        [TestMethod]
        public async Task ArchiveProject()
        {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                Description = "This project must be archived!",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "PLEASE ARCHIVE"
                }
            });

            Assert.IsTrue(createResult.Success);

            await projectController.ArchiveProject(new ArchiveProjectDTO()
            {
                Archive = true,
                ProjectId = createResult.Data
            });

            var projectUpdated = await projectController.GetProjectById(createResult.Data);

            // This test will fail if it starts on one day and ends on another
            // I think the chances of that would be like winning the lottery though so we ok
            Assert.IsTrue(projectUpdated.Data.ArchivedDate.Value.Date == DateTime.UtcNow.Date);

            await projectController.ArchiveProject(new ArchiveProjectDTO()
            {
                Archive = false,
                ProjectId = createResult.Data
            });

            projectUpdated = await projectController.GetProjectById(createResult.Data);
            Assert.IsNull(projectUpdated.Data.ArchivedDate);
        }

        [TestMethod]
        public async Task GetArchivedProjects() {
            var createResult = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Mr Dr Professor",
                Description = "This project must be archived!",
                ProjectName = "Test Name",
                Tags = new List<string>()
                {
                    "PLEASE ARCHIVE"
                }
            });

            Assert.IsTrue(createResult.Success);

            await projectController.ArchiveProject(new ArchiveProjectDTO()
            {
                Archive = true,
                ProjectId = createResult.Data
            });

            var projectUpdated = await projectController.GetProjectById(createResult.Data);

            var archivedProjects = await projectController.GetArchivedProjectsByUser();

            Assert.AreEqual(1, archivedProjects.Data.Count);
            Assert.AreEqual("Mr Dr Professor", archivedProjects.Data[0].ClientName);
        }
    }
}
