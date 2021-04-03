using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Database;

namespace TimeTracker.Test.Helpers
{
    public static class TestAuthHelpers
    {
        public static async Task LogInUser(MainDb db, IConfiguration configuration, ControllerBase controller, string inviteCode = null) 
        {
            await LogInUser(db, configuration, new List<ControllerBase>() 
            {
                controller
            }, inviteCode);
        }

        public static async Task LogInUser(MainDb db, IConfiguration configuration, List<ControllerBase> controllers, string inviteCode = null) 
        {
            var authController = new AuthController(db, configuration, new AuthHelper());
            var userEmail = Guid.NewGuid().ToString();

            var userId = (await authController.Register(new UserDTO()
            {
                Email = $"{userEmail}@gmail.com",
                Password = "TeztUzer1",
                FirstName = userEmail,
                LastName = "Last" + userEmail,
                InviteCode = inviteCode
            })).Data;
            
            var user = new ClaimsPrincipal(new List<ClaimsIdentity>()
            {
                new ClaimsIdentity(new List<Claim>()
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                })
            });

            foreach(var controller in controllers)
            {
                controller.ControllerContext.HttpContext = new DefaultHttpContext()
                {
                    User = user
                };
            }
        }

        public static void attachUserToContext(int userID, List<ControllerBase> controllers) {
            var user = new ClaimsPrincipal(new List<ClaimsIdentity>()
            {
                new ClaimsIdentity(new List<Claim>()
                {
                    new Claim(ClaimTypes.NameIdentifier, userID.ToString())
                })
            });

            foreach(ControllerBase controller in controllers) {
                controller.ControllerContext.HttpContext = new DefaultHttpContext() {
                    User = user
                };
            }
        }
    }

    
}
