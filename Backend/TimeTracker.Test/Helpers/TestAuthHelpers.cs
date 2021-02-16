using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.Database;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;

namespace TimeTracker.Test.Helpers
{
    public static class TestAuthHelpers
    {
        public static async Task LogInUser(MainDb db, IConfiguration configuration, ControllerBase controller) 
        {
            var authController = new AuthController(db, configuration, new AuthHelper());
            var userEmail = Guid.NewGuid().ToString();

            var userId = (await authController.Register(new UserDTO()
            {
                Email = $"{userEmail}@gmail.com",
                Password = "TeztUzer1"
            })).Data;
            
            var user = new ClaimsPrincipal(new List<ClaimsIdentity>()
            {
                new ClaimsIdentity(new List<Claim>()
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                })
            });

            controller.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = user
            };
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
