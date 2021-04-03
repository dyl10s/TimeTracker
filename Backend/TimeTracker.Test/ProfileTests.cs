using Microsoft.VisualStudio.TestTools.UnitTesting;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.Helpers;
using TimeTracker.Api.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TimeTracker.Test.Helpers;
using TimeTracker.Database.Models;

namespace TimeTracker.Test {
    [TestClass]
    public class ProfileTests : BaseTest {
        ProfileController profileController;
        AuthController authController;
        AuthHelper authHelper;
        List<ControllerBase> controllers;
        public ProfileTests() {
            authHelper = new AuthHelper();
            profileController = new ProfileController(database, authHelper, configuration);
            authController = new AuthController(database, configuration, authHelper);
            controllers = new List<ControllerBase>();
            controllers.Add(profileController);
            controllers.Add(authController);
        }

        [TestMethod]
        public async Task ViewProfileTest_ValidInfo() {

            UserDTO newUser = new UserDTO {
                Email = "moxie@123.net",
                Password = "Ag00dPassw0rd",
                FirstName = "Moxie",
                LastName = "Bespin"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            TestAuthHelpers.attachUserToContext(registerResponse.Data, controllers);

            ProfileDTO expectedProfileInfo = new ProfileDTO {
                FirstName = "Moxie",
                LastName = "Bespin",
                Email = "moxie@123.net",
                Projects = new List<string>()
            };

            GenericResponseDTO<ProfileDTO> response = await profileController.GetUserProfile();
            Assert.IsTrue(response.Success);
            Assert.AreEqual(response.Data.FirstName, expectedProfileInfo.FirstName);
            Assert.AreEqual(response.Data.LastName, expectedProfileInfo.LastName);
            Assert.AreEqual(response.Data.Email, expectedProfileInfo.Email);
            Assert.IsTrue(response.Data.Projects.SequenceEqual(expectedProfileInfo.Projects));
        }

        [TestMethod]
        public async Task UpdateProfileTest() {
            UserDTO newUser = new UserDTO {
                Email = "moxie@123.net",
                Password = "Ag00dPassw0rd",
                FirstName = "Moxie",
                LastName = "Bespin"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            TestAuthHelpers.attachUserToContext(registerResponse.Data, controllers);

            ProfileDTO expectedProfileInfo = new ProfileDTO {
                FirstName = "Changed",
                LastName = "Name",
                Projects = new List<string>()
            };

            GenericResponseDTO<ProfileDTO> response1 = await profileController.GetUserProfile();
            Assert.IsTrue(response1.Success);
            Assert.AreEqual(response1.Data.FirstName, newUser.FirstName);
            Assert.AreEqual(response1.Data.LastName, newUser.LastName);

            await profileController.UpdateUserProfile(new ProfileUpdateDTO()
            {
                FirstName = "Changed",
                LastName = "Name"
            });

            GenericResponseDTO<ProfileDTO> response2 = await profileController.GetUserProfile();
            Assert.IsTrue(response2.Success);
            Assert.AreEqual(response2.Data.FirstName, expectedProfileInfo.FirstName);
            Assert.AreEqual(response2.Data.LastName, expectedProfileInfo.LastName);
            Assert.IsTrue(response2.Data.Projects.SequenceEqual(expectedProfileInfo.Projects));
        }

        [TestMethod]
        public async Task ViewProfileTest_WithoutLoggingIn() {
            GenericResponseDTO<ProfileDTO> response = await profileController.GetUserProfile();
            Assert.IsFalse(response.Success);
        }

        [TestMethod]
        public async Task SetPasswordTest_ValidInfo() {

            UserDTO newUser = new UserDTO {
                Email = "phoebe@123.net",
                Password = "Aquarius13",
                FirstName = "Phoebe",
                LastName = "S."
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            TestAuthHelpers.attachUserToContext(registerResponse.Data, controllers);

            GenericResponseDTO<AccessKeysDTO> loginResponse = await authController.Login(newUser);
            Assert.IsTrue(registerResponse.Success);

            PasswordChangeDTO passwordChangeInfo = new PasswordChangeDTO {
                CurrentPassword = "Aquarius13",
                NewPassword = "Aero125"
            };
            GenericResponseDTO<int> changePasswordResponse = await profileController.SetPassword(passwordChangeInfo);
            Assert.IsTrue(changePasswordResponse.Success);

            User currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsTrue(authHelper.GetPasswordHash("Aero125", configuration).SequenceEqual(currentUser.Password));            

            loginResponse = await authController.Login(newUser);
            Assert.IsFalse(loginResponse.Success);

            passwordChangeInfo.CurrentPassword = "Aero125";
            passwordChangeInfo.NewPassword = "Aquarius13";
            changePasswordResponse = await profileController.SetPassword(passwordChangeInfo);
            Assert.IsTrue(changePasswordResponse.Success);

            currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsTrue(authHelper.GetPasswordHash("Aquarius13", configuration).SequenceEqual(currentUser.Password));  

            loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);
        }

        [TestMethod]
        public async Task SetPasswordTest_InvalidNewPassword() {

            UserDTO newUser = new UserDTO {
                Email = "belford@123.net",
                Password = "sand_Boa13",
                FirstName = "Belford",
                LastName = "McAlister"
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            TestAuthHelpers.attachUserToContext(registerResponse.Data, controllers);

            GenericResponseDTO<AccessKeysDTO> loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);

            PasswordChangeDTO passwordChangeInfo = new PasswordChangeDTO {
                CurrentPassword = "sand_Boa13",
                NewPassword = "badpw"
            };
            GenericResponseDTO<int> changePasswordResponse = await profileController.SetPassword(passwordChangeInfo);
            Assert.IsFalse(changePasswordResponse.Success);

            User currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsFalse(authHelper.GetPasswordHash("badpw", configuration).SequenceEqual(currentUser.Password));
            Assert.IsTrue(authHelper.GetPasswordHash("sand_Boa13", configuration).SequenceEqual(currentUser.Password));

            loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);
        }

        [TestMethod]
        public async Task SetPasswordTest_IncorrectVerificationPassword() {

            UserDTO newUser = new UserDTO {
                Email = "basther@123.net",
                Password = "1fOur3niNe7",
                FirstName = "Basther",
                LastName = "H."
            };

            GenericResponseDTO<int> registerResponse = await authController.Register(newUser);
            Assert.IsTrue(registerResponse.Success);

            TestAuthHelpers.attachUserToContext(registerResponse.Data, controllers);

            GenericResponseDTO<AccessKeysDTO> loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);

            PasswordChangeDTO passwordChangeInfo = new PasswordChangeDTO {
                CurrentPassword = "oNe4thRee9seVen",
                NewPassword = "P4st_Midnight"
            };

            GenericResponseDTO<int> changePasswordResponse = await profileController.SetPassword(passwordChangeInfo);
            Assert.IsFalse(changePasswordResponse.Success);

            User currentUser = await database.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.Id == registerResponse.Data);
            Assert.IsFalse(authHelper.GetPasswordHash("oNe4thRee9seVen", configuration).SequenceEqual(currentUser.Password));
            Assert.IsTrue(authHelper.GetPasswordHash("1fOur3niNe7", configuration).SequenceEqual(currentUser.Password));

            loginResponse = await authController.Login(newUser);
            Assert.IsTrue(loginResponse.Success);

        }
    }
    
}