using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using TimeTracker.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace TimeTracker.Api.Controllers {

    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase {

        MainDb database;
        AuthHelper authHelper;
        IConfiguration configuration;
        
        public ProfileController(MainDb database, AuthHelper authHelper, IConfiguration configuration) {
            this.database = database;
            this.authHelper = authHelper;
            this.configuration = configuration;
        }

        [HttpGet]
        public async Task<GenericResponseDTO<ProfileDTO>> GetUserProfile() {

            int currentUserID;

            try {
                currentUserID = authHelper.GetCurrentUserId(User);
            } catch(System.NullReferenceException) {
                return new GenericResponseDTO<ProfileDTO> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            User queryResult = await database.Users
                .AsNoTracking()
                .Include(x => x.Projects)
                .FirstOrDefaultAsync(user => user.Id == currentUserID);
            
            if(queryResult == null) {
                return new GenericResponseDTO<ProfileDTO> {
                    Message = "No matching User ID found.",
                    Success = false
                };
            }

            return new GenericResponseDTO<ProfileDTO>() {
                Data = new ProfileDTO() {
                    Email = queryResult.Email,
                    FirstName = queryResult.FirstName,
                    LastName = queryResult.LastName,
                    Projects = queryResult.Projects
                        .Select(x => x.Name)
                        .ToList()
                },
                Success = true
            };

        }


        /// <summary>
        /// Updates a users name
        /// </summary>
        /// <param name="updatedInformation"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<GenericResponseDTO<int>> UpdateUserProfile(ProfileUpdateDTO profileUpdateInfo)
        {
            int currentUserID;

            try {
                currentUserID = authHelper.GetCurrentUserId(User);
            } catch(System.NullReferenceException) {
                return new GenericResponseDTO<int> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            User currentUser = await database.Users
                .FirstOrDefaultAsync(user => user.Id == currentUserID);

            currentUser.FirstName = profileUpdateInfo.FirstName;
            currentUser.LastName = profileUpdateInfo.LastName;
            await database.SaveChangesAsync();

            return new GenericResponseDTO<int>
            {
                Success = true,
                Data = currentUser.Id
            };
        }

        [HttpPost]
        [Route("/SetPassword")]
        public async Task<GenericResponseDTO<int>> SetPassword(PasswordChangeDTO passwordInfo) {

            int currentUserID;

            try {
                currentUserID = authHelper.GetCurrentUserId(User);
            } catch(System.NullReferenceException) {
                return new GenericResponseDTO<int> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            User currentUser = await database.Users
                .FirstOrDefaultAsync(user => user.Id == currentUserID);

            if(currentUser == null) {
                return new GenericResponseDTO<int> {
                    Message = "No matching User ID found.",
                    Success = false
                };
            }

            if(!currentUser.Password.SequenceEqual(authHelper.GetPasswordHash(passwordInfo.CurrentPassword, configuration))) {
                return new GenericResponseDTO<int> {
                    Message = "Current password is incorrect.",
                    Success = false
                };
            }

            if(!authHelper.IsValidPassword(passwordInfo.NewPassword)) {
                return new GenericResponseDTO<int> {
                    Success = false,
                    Message = "Invalid new password, the password must contain a lowercase letter, uppercase letter, a number and be at least 7 characters."
                };
            }

            currentUser.Password = authHelper.GetPasswordHash(passwordInfo.NewPassword, configuration);
            await database.SaveChangesAsync();

            return new GenericResponseDTO<int> {
                Success = true
            };
        }

    }
}