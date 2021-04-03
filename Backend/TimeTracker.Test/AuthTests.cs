using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TimeTracker.Test.Helpers;
using Microsoft.EntityFrameworkCore;
using TimeTracker.Database.Models;

namespace TimeTracker.Test
{
    [TestClass]
    public class AuthTests : BaseTest
    {
        AuthController authController;
        ProjectController projectController;
        AuthHelper authHelper;
        List<ControllerBase> controllers;
        public AuthTests()
        {
            authHelper = new AuthHelper();
            authController = new AuthController(database, configuration, authHelper);
            projectController = new ProjectController(database, authHelper);
            controllers = new List<ControllerBase>();
            controllers.Add(authController);
            controllers.Add(projectController);
        }

        [TestMethod]
        public async Task CreateTestUser()
        {
            var loginFailResults = await authController.Login(new UserDTO()
            {
                Email = "test@gmail.com",
                Password = "testPass1"
            });

            Assert.IsFalse(loginFailResults.Success);
            
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "test@gmail.com",
                FirstName = "test",
                LastName = "test",
                Password = "testPass1"
            });

            Assert.IsTrue(registerResults.Success);

            var loginResults = await authController.Login(new UserDTO()
            {
                Email = "test@gmail.com",
                Password = "testPass1"
            });

            Assert.IsNotNull(loginResults.Data);

            var refreshResults = await authController.Refresh(new RefreshDTO() 
            {
                Email = "test@gmail.com",
                RefreshToken = loginResults.Data.RefreshToken
            });

            Assert.IsNotNull(refreshResults.Data);
        }

        [TestMethod]
        public async Task CreateTestUserWithInviteCode()
        {
            
            await TestAuthHelpers.LogInUser(database, configuration, projectController);

            ProjectCreateDTO projectInfo = new ProjectCreateDTO {
                ProjectName = "Soup Delivery Website",
                ClientName = "Soup Delivery LLC"
            };

            GenericResponseDTO<int> createProjectResponse = await projectController.CreateProject(projectInfo);
            Assert.IsTrue(createProjectResponse.Success);

            int projectID = createProjectResponse.Data;
            Project project = await database.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == projectID);
            string projectInviteCode = project.InviteCode;

            UserDTO registrationInfo = new UserDTO {
                Email = "suzuya@321.org",
                Password = "decentPassword7",
                FirstName = "Suzuya",
                LastName = "Z.",
                InviteCode = projectInviteCode
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(registrationInfo);
            Assert.IsTrue(registerResponse.Success);

            User user = await database.Users
                .Include(x => x.Projects)
                .FirstOrDefaultAsync(u => u.Id == registerResponse.Data);

            Assert.IsTrue(user.Projects.Count == 1);
            Assert.IsTrue(user.Projects[0].Id == project.Id);
        }
    
        [TestMethod]
        public async Task InvalidPassword()
        {
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "test@gmail.com",
                FirstName = "test",
                LastName = "test",
                Password = "testpass"
            });

            Assert.IsFalse(registerResults.Success);
        }   

        [TestMethod]
        public async Task InvalidEmail()
        {
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "testgmail.com",
                FirstName = "test",
                LastName = "test",
                Password = "testPass1"
            });

            Assert.IsFalse(registerResults.Success);
        }  
        
        [TestMethod]
        public async Task NoMatchingEmails()
        {
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "match1@gmail.com",
                FirstName = "test",
                LastName = "test",
                Password = "testPass1"
            });

            Assert.IsTrue(registerResults.Success);

            var registerResults2 = await authController.Register(new UserDTO()
            {
                Email = "match1@gmail.com",
                FirstName = "test",
                LastName = "test",
                Password = "testPass1"
            });

            Assert.IsFalse(registerResults2.Success);
        }

        [TestMethod]
        public async Task AddUserToProjectOnLogin()
        {
            await TestAuthHelpers.LogInUser(database, configuration, projectController);

            ProjectCreateDTO projectInfo = new ProjectCreateDTO {
                ProjectName = "Soup Delivery Website",
                ClientName = "Soup Delivery LLC"
            };

            GenericResponseDTO<int> createProjectResponse = await projectController.CreateProject(projectInfo);
            Assert.IsTrue(createProjectResponse.Success);

            int projectID = createProjectResponse.Data;
            Project project = await database.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == projectID);
            string projectInviteCode = project.InviteCode;

            UserDTO registrationInfo = new UserDTO {
                Email = "suzuya@321.org",
                Password = "decentPassword7",
                FirstName = "Suzuya",
                LastName = "Z."
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(registrationInfo);
            Assert.IsTrue(registerResponse.Success);

            UserDTO loginInfo = new UserDTO {
                Email = "suzuya@321.org",
                Password = "decentPassword7",
                InviteCode = projectInviteCode
            };

            await authController.Login(loginInfo);

            User user = await database.Users
                .Include(x => x.Projects)
                .FirstOrDefaultAsync(u => u.Id == registerResponse.Data);

            Assert.IsTrue(user.Projects.Count == 1);
            Assert.IsTrue(user.Projects[0].Id == project.Id);
        }  

        [TestMethod]
        public async Task LinkDiscordAccount()
        {
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "testDiscord@gmail.com",
                FirstName = "Test",
                LastName = "Discord",
                Password = "TestDiscord1!"
            });

            database.DiscordLinks.Add(new DiscordLink()
            {
                DiscordId = "TestId",
                LinkKey = "TestLink"
            });

            await database.SaveChangesAsync();

            var linkResults = await authController.Link(new UserDTO()
            {
                DiscordLink = "TestLink",
                Email = "testDiscord@gmail.com",
                Password = "TestDiscord1!"
            });

            Assert.IsTrue(linkResults.Success);
            Assert.IsTrue(linkResults.Data);

            var currentUser = await database.Users.AsQueryable().AsNoTracking().FirstOrDefaultAsync(x => x.Id == registerResults.Data);
            Assert.AreEqual("TestId", currentUser.DiscordId);

            var linkResultsBadLinkCode = await authController.Link(new UserDTO()
            {
                DiscordLink = "BadLink",
                Email = "testDiscord@gmail.com",
                Password = "TestDiscord1!"
            });

            Assert.IsTrue(linkResultsBadLinkCode.Success);
            Assert.IsFalse(linkResultsBadLinkCode.Data);

            var linkResultsBadLogin = await authController.Link(new UserDTO()
            {
                DiscordLink = "BadLink",
                Email = "testDiscord1@gmail.com",
                Password = "TestDiscord12!"
            });

            Assert.IsFalse(linkResultsBadLogin.Success);
            Assert.IsFalse(linkResultsBadLogin.Data);
        }
    }
}
