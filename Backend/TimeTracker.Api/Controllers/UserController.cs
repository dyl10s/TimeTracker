using Microsoft.AspNetCore.Mvc;           // ControllerBase
using System.Threading.Tasks;             // Task
using TimeTracker.Api.DTOs;               // UserDTO
using TimeTracker.Api.Database;           // MainDb
using TimeTracker.Api.Database.Models;    // User
using Microsoft.EntityFrameworkCore;      // .AsNoTracking()
using System.Linq;                        // .Where()
using TimeTracker.Api.Helpers;            // AuthHelper
using Microsoft.AspNetCore.Authorization; // [Authorize]
using Microsoft.Extensions.Configuration; // IConfiguration
using System.Collections.Generic;         // List<>

namespace TimeTracker.Api.Controllers {

    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class UserController : ControllerBase {

        MainDb database;
        AuthHelper authHelper;
        IConfiguration configuration;
        int currentUserID;
        
        public UserController(MainDb database, AuthHelper authHelper, IConfiguration configuration) {
            this.database = database;
            this.authHelper = authHelper;
            this.configuration = configuration;
            currentUserID = authHelper.GetCurrentUserId(User);
        }

        [HttpGet]
        public async Task<GenericResponseDTO<ProfileDTO>> GetUserProfile() {

            User queryResult = await database.Users
                .AsNoTracking()
                .Include(x => x.Projects)
                .FirstOrDefaultAsync(user => user.Id == currentUserID);
            
            if(queryResult == default(Database.Models.User)) {
                return new GenericResponseDTO<ProfileDTO> {
                    Message = "No matching User ID found.",
                    Success = false
                };
            }

            return new GenericResponseDTO<ProfileDTO>() {
                Data = new ProfileDTO() {
                    Email = queryResult.Email,
                    Name = queryResult.Name,
                    Projects = queryResult.Projects
                        .Select(x => x.Name)
                        .ToList()
                },
                Success = true
            };

        }

        [HttpPost]
        [Route("/SetPassword")]
        public async Task<GenericResponseDTO<int>> SetPassword(string password) {

            User queryResult = await database.Users
                .AsQueryable()
                .FirstOrDefaultAsync(user => user.Id == currentUserID);

            if(queryResult == default(Database.Models.User)) {
                return new GenericResponseDTO<int> {
                    Message = "No matching User ID found.",
                    Success = false
                };
            }

            queryResult.Password = authHelper.GetPasswordHash(password, configuration);
            database.SaveChanges();

            return new GenericResponseDTO<int> {
                Success = true
            };
        }

    }
}