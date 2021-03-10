﻿
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using System.Collections.Generic;

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
                User curUser = await database.Users
                    .Include(x => x.Projects)
                    .FirstOrDefaultAsync(u => u.Email == loginData.Email && u.Password.SequenceEqual(hashedPassword));

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
                        .FirstOrDefaultAsync(p => p.InviteCode == loginData.InviteCode);

                    if(project != null) {
                        curUser.Projects.Add(project);
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
                    }
                };
            }
            catch
            {
                return new GenericResponseDTO<AccessKeysDTO>() 
                {
                    Success = false,
                    Message = "An unknown error has occured"
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
                if(await database.Users.AnyAsync(x => x.Email.ToLower() == registerData.Email.ToLower()) == true)
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

                // check if the user registered with an invite code, if they did, add them to a project
                if(!String.IsNullOrWhiteSpace(registerData.InviteCode)) {

                    Project project = await database.Projects
                        .FirstOrDefaultAsync(p => p.InviteCode == registerData.InviteCode);

                    if(project != null) {
                        newUser.Projects.Add(project);
                    }

                }

                await database.SaveChangesAsync();

                return new GenericResponseDTO<int>() 
                {
                    Success = true,
                    Data = newUser.Id
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
                // Find the user attatched to the token
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
                    Message = "An unknown error has occured"
                };
            }
        }
    }
}
