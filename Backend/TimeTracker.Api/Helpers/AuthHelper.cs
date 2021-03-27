using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;

namespace TimeTracker.Api.Helpers
{
    /// <summary>
    /// This class holds helper functions used by the auth controller
    /// </summary>
    public class AuthHelper
    {
        public byte[] GetPasswordHash(string password, IConfiguration configuration)
        {
            // Create a password hash with salt from the configuration
            byte[] passData = Encoding.UTF8.GetBytes(password + configuration.GetValue<string>("PasswordSalt"));
            using(var hasher = SHA256.Create())
            {
                return hasher.ComputeHash(passData);
            }
        }

        public bool IsValidPassword(string password)
        {
            if(password.Length < 7)
            {
                return false;
            }

            bool containsNumber = password.Any(x => char.IsDigit(x));
            bool containsUppercase = password.Any(x => char.IsUpper(x));
            bool containsLowercase = password.Any(x => char.IsLower(x));

            if(!containsLowercase || !containsNumber || !containsUppercase)
            {
                return false;
            }

            return true;
        }

        public bool IsValidEmail(string email)
        {
            if(string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            bool containsAt = email.Any(x => x == '@');
            bool containsDot = email.Any(x => x == '.');

            if(!containsAt || !containsDot)
            {
                return false;
            }

            return true;
        }

        public string GenerateRefreshToken()
        {
            // Create a token from 2 guids combined
            return Guid.NewGuid().ToString().Replace("-", "") + Guid.NewGuid().ToString().Replace("-", "");
        }

        public async Task<User> GetCurrentUser(ClaimsPrincipal user, MainDb db)
        {
            var currentUserId = GetCurrentUserId(user);
            var currentUser = await db.Users.AsQueryable().FirstAsync(x => x.Id == currentUserId);
            return currentUser;
        }

        public int GetCurrentUserId(ClaimsPrincipal user)
        {
            var currentUserId = int.Parse(user.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            return currentUserId;
        }

        public string GenerateJSONWebToken(User loggedInUser, IConfiguration configuration)    
        {    
            // Create a jwt token and sign it
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Jwt").GetValue<string>("Key")));    
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);    
    
            // Add claims to the jwt
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, loggedInUser.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, loggedInUser.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, loggedInUser.FirstName + " " + loggedInUser.LastName)
            };

            var token = new JwtSecurityToken(
                configuration.GetSection("Jwt").GetValue<string>("Issuer"),    
                configuration.GetSection("Jwt").GetValue<string>("Issuer"),    
                claims,    
                expires: DateTime.Now.AddMinutes(60),    
                signingCredentials: credentials);    
    
            return new JwtSecurityTokenHandler().WriteToken(token);    
        }   
    }
}
