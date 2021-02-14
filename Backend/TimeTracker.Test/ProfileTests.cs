using Microsoft.VisualStudio.TestTools.UnitTesting;  // TestClass
using TimeTracker.Api.Controllers;                   // ProfileController
using TimeTracker.Api.Helpers;                       // AuthHelper
using TimeTracker.Api.DTOs;                          // DTOs
using System.Threading.Tasks;                        // Task
using System.Security.Claims;                        // Claims stuff
using System.Collections.Generic;                    // List
using Microsoft.AspNetCore.Http;                     // DefaultHttpContext
using Microsoft.EntityFrameworkCore;                 // .AsNoTracking()
using TimeTracker.Api.Database.Models;               // User
using System.Linq;                                   // SequenceEqual

namespace TimeTracker.Test {
    [TestClass]
    public class ProfileTests : BaseTest {
        ProfileController profileController;
        AuthController authController;
        AuthHelper authHelper;
        public ProfileTests() {
            authHelper = new AuthHelper();
            profileController = new ProfileController(database, authHelper, configuration);
            authController = new AuthController(database, configuration, authHelper);
        }

        private void attachUserToContext(int userID) {
            var user = new ClaimsPrincipal(new List<ClaimsIdentity>()
            {
                new ClaimsIdentity(new List<Claim>()
                {
                    new Claim(ClaimTypes.NameIdentifier, userID.ToString())
                })
            });

            profileController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = user
            };
            authController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = user
            };
        }

        [TestMethod]
        public async Task ViewProfile1() {

            UserDTO newUser = new UserDTO {
                Email = "moxie@123.net",
                Password = "Ag00dPassw0rd",
                Name = "Moxie"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            attachUserToContext(registerResponse.Data);

            ProfileDTO expectedProfileInfo = new ProfileDTO {
                Name = "Moxie",
                Email = "moxie@123.net",
                Projects = new List<string>()
            };

            GenericResponseDTO<ProfileDTO> response = await profileController.GetUserProfile();
            Assert.IsTrue(response.Success);
            Assert.AreEqual(response.Data.Name, expectedProfileInfo.Name);
            Assert.AreEqual(response.Data.Email, expectedProfileInfo.Email);
            Assert.IsTrue(response.Data.Projects.SequenceEqual(expectedProfileInfo.Projects));
        }

        [TestMethod]
        public async Task ViewProfile2() {
            GenericResponseDTO<ProfileDTO> response = await profileController.GetUserProfile();
            Assert.IsFalse(response.Success);
        }

        [TestMethod]
        public async Task SetPasswordTest1() {

            UserDTO newUser = new UserDTO {
                Email = "phoebe@123.net",
                Password = "Aquarius13",
                Name = "Phoebe"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            attachUserToContext(registerResponse.Data);

            GenericResponseDTO<AccessKeysDTO> loginResponse = await authController.Login(newUser);
            Assert.IsTrue(registerResponse.Success);

            GenericResponseDTO<int> changePasswordResponse = await profileController.SetPassword("Aero125");
            Assert.IsTrue(changePasswordResponse.Success);

            User currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsTrue(authHelper.GetPasswordHash("Aero125", configuration).SequenceEqual(currentUser.Password));            

            loginResponse = await authController.Login(newUser);
            Assert.IsFalse(loginResponse.Success);

            changePasswordResponse = await profileController.SetPassword("Aquarius13");
            Assert.IsTrue(changePasswordResponse.Success);

            currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsTrue(authHelper.GetPasswordHash("Aquarius13", configuration).SequenceEqual(currentUser.Password));  

            loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);
        }

        [TestMethod]
        public async Task SetPasswordTest2() {

            UserDTO newUser = new UserDTO {
                Email = "belford@123.net",
                Password = "sand_Boa13",
                Name = "Belford"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            attachUserToContext(registerResponse.Data);

            GenericResponseDTO<AccessKeysDTO> loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);

            GenericResponseDTO<int> changePasswordResponse = await profileController.SetPassword("badpw");
            Assert.IsFalse(changePasswordResponse.Success);

            User currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsFalse(authHelper.GetPasswordHash("badpw", configuration).SequenceEqual(currentUser.Password));
            Assert.IsTrue(authHelper.GetPasswordHash("sand_Boa13", configuration).SequenceEqual(currentUser.Password));

            loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);
        }
    }
    
}