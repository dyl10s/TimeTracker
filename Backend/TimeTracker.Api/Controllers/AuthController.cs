
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using System.Collections.Generic;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace TimeTracker.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        MainDb database;
        IConfiguration configuration;
        AuthHelper authHelper;

        public AuthController(MainDb db, IConfiguration config, AuthHelper helper)
        {
            database = db;
            configuration = config;
            authHelper = helper;
        }

        /// <summary>
        /// Endpoint to login the user
        /// </summary>
        /// <param name="loginData">This holds the username and password of the attempted login</param>
        /// <returns>A response with an access key and a refresh key</returns>
        [Route("Login")]
        [HttpPost]
        public async Task<GenericResponseDTO<AccessKeysDTO>> Login(UserDTO loginData)
        {
            try
            {
                // Get user with a matching username and password hash
                var hashedPassword = authHelper.GetPasswordHash(loginData.Password, configuration);
                String message = "";
                var curUser = await database.Users
                    .Include(x => x.Projects)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == loginData.Email.ToLower() && u.Password.SequenceEqual(hashedPassword));

                // If there was not a matching user then return an error
                if(curUser == null)
                {
                    return new GenericResponseDTO<AccessKeysDTO>()
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Generate the JWT and Refresh tokens and save the refresh token to the db
                var accessToken = authHelper.GenerateJSONWebToken(curUser, configuration);
                var refreshToken = authHelper.GenerateRefreshToken();

                var userRefreshToken = new RefreshToken()
                {
                    Token = refreshToken,
                    User = curUser
                };

                // check if the user logged in with an invite code, if they did, add them to a project
                if(!String.IsNullOrWhiteSpace(loginData.InviteCode)) {

                    Project project = await database.Projects
                        .AsQueryable()
                        .FirstOrDefaultAsync(p => p.InviteCode == loginData.InviteCode);

                    if(project != null){
                        if(project.ArchivedDate != null){
                            message = "Unable to add to Archived Project";
                        }else{
                            if(curUser.Projects.Contains(project)){
                                message = "User already in project";
                            }else{
                                curUser.Projects.Add(project);
                                message = "Added User to Project";
                            }
                        }
                    }else{
                        message = "Project not found";
                    }

                }

                await database.AddAsync(userRefreshToken);
                await database.SaveChangesAsync();

                return new GenericResponseDTO<AccessKeysDTO>() 
                {
                    Success = true,
                    Data = new AccessKeysDTO()
                    {
                         AccessToken = accessToken,
                         RefreshToken = refreshToken
                    },
                    Message = message
                };
            }
            catch
            {
                return new GenericResponseDTO<AccessKeysDTO>() 
                {
                    Success = false,
                    Message = "An unknown error has occurred"
                };
            }
        }

        /// <summary>
        /// Endpoint to register a new user this defaults
        /// the user to be a teacher
        /// </summary>
        /// <param name="registerData">This holds the registration information</param>
        /// <returns>The Id of the user that was created</returns>
        [Route("Register")]
        [HttpPost]
        public async Task<GenericResponseDTO<int>> Register(UserDTO registerData)
        {
            try
            {
                // Make sure the password is valid
                if (!authHelper.IsValidPassword(registerData.Password))
                {
                    return new GenericResponseDTO<int>() 
                    {
                        Success = false,
                        Message = "Invalid password, the password must contain a lowercase letter, uppercase letter, a number and be at least 7 characters"
                    };
                }

                // Make sure the email is valid
                if (!authHelper.IsValidEmail(registerData.Email))
                {
                    return new GenericResponseDTO<int>() 
                    {
                        Success = false,
                        Message = "Invalid email"
                    };
                }

                // Make sure the email is unique
                if(await database.Users.AsQueryable().AnyAsync(x => x.Email.ToLower() == registerData.Email.ToLower()) == true)
                {
                    return new GenericResponseDTO<int>() 
                    {
                        Success = false,
                        Message = "This email already exists"
                    };
                }

                // Create the new user and add them to the database
                var newUser = new User()
                {
                    CreatedTime = DateTime.UtcNow,
                    Email = registerData.Email,
                    Password = authHelper.GetPasswordHash(registerData.Password, configuration),
                    FirstName = registerData.FirstName,
                    LastName = registerData.LastName,
                    Projects = new List<Project>()
                };

                await database.AddAsync(newUser);

                String message = "";

                // check if the user registered with an invite code, if they did, add them to a project
                if(!String.IsNullOrWhiteSpace(registerData.InviteCode)) {

                    Project project = await database.Projects
                        .AsQueryable()
                        .FirstOrDefaultAsync(p => p.InviteCode == registerData.InviteCode);

                    if(project != null){
                        if(project.ArchivedDate != null){
                            message = "Unable to add to Archived Project";
                        }else{
                            newUser.Projects.Add(project);
                            message = "Added User to Project";
                        }
                    }else{
                        message = "Project not found";
                    }

                }

                await database.SaveChangesAsync();

                return new GenericResponseDTO<int>() 
                {
                    Success = true,
                    Data = newUser.Id,
                    Message = message
                };
            }
            catch
            {
                return new GenericResponseDTO<int>() 
                {
                    Success = false,
                    Message = "An unknown error has occurred"
                };
            }
        }

        /// <summary>
        /// This endpoint generates a new access token from a refresh token and the users email.
        /// </summary>
        /// <param name="refreshData">The refresh token and the email of the user it belongs to.</param>
        /// <returns>A new access token as well as the same refresh token to be used again</returns>
        [Route("Refresh")]
        [HttpPost]
        public async Task<GenericResponseDTO<AccessKeysDTO>> Refresh(RefreshDTO refreshData)
        {
            try
            {
                // Find the user attached to the token
                var curToken = await database.RefreshTokens
                    .Include(x => x.User)
                    .Where(x => x.Token == refreshData.RefreshToken && x.User.Email == refreshData.Email)
                    .FirstOrDefaultAsync();
            
                // If the token was not found return an error
                if (curToken == null)
                {
                    return new GenericResponseDTO<AccessKeysDTO>()
                    {
                        Success = false,
                        Message = "Invaid Token"
                    };
                }

                // Generate a new JWT token
                var curUser = curToken.User;
                var jwtToken = authHelper.GenerateJSONWebToken(curUser, configuration);

                return new GenericResponseDTO<AccessKeysDTO>()
                {
                    Success = true,
                    Data = new AccessKeysDTO()
                    {
                        AccessToken = jwtToken,
                        RefreshToken = curToken.Token
                    }
                };
            }
            catch
            {
                return new GenericResponseDTO<AccessKeysDTO>()
                {
                    Success = false,
                    Message = "An unknown error has occurred"
                };
            }
        }

        /// <summary>
        /// This endpoint is used to link a Discord account to an NTime account.
        /// </summary>
        /// <param name="loginData">The use login / discord link information</param>
        /// <returns>A boolean value that says if the link was successful or not</returns>
        [Route("Link")]
        [HttpPost]
        public async Task<GenericResponseDTO<bool>> Link(UserDTO loginData)
        {
            try
            {
                // Get user with a matching username and password hash
                var hashedPassword = authHelper.GetPasswordHash(loginData.Password, configuration);
                var curUser = await database.Users
                    .Include(x => x.Projects)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == loginData.Email.ToLower() && u.Password.SequenceEqual(hashedPassword));

                // If there was not a matching user then return an error
                if (curUser == null)
                {
                    return new GenericResponseDTO<bool>()
                    {
                        Data = false,
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Find the linked discord account
                var discordLinkedAccount = await database.DiscordLinks
                    .AsQueryable()
                    .SingleOrDefaultAsync(x => x.LinkKey == loginData.DiscordLink);

                if(discordLinkedAccount == null)
                {
                    // Invalid link
                    return new GenericResponseDTO<bool>()
                    {
                        Success = true,
                        Data = false
                    };
                }

                curUser.DiscordId = discordLinkedAccount.DiscordId;

                // Delete all link requests from this dicord user
                var allRequests = await database.DiscordLinks
                    .AsQueryable()
                    .Where(x => x.DiscordId == discordLinkedAccount.DiscordId)
                    .ToListAsync();

                database.RemoveRange(allRequests);
                await database.SaveChangesAsync();

                return new GenericResponseDTO<bool>()
                {
                    Success = true,
                    Data = true
                };
            }
            catch
            {
                return new GenericResponseDTO<bool>()
                {
                    Data = false,
                    Success = false,
                    Message = "An unknown error has occurred"
                };
            }
        }
    }
}
