using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;

namespace TimeTracker.Test
{
    [TestClass]
    public class AuthTests : BaseTest
    {
        AuthController authController;
        public AuthTests()
        {
            authController = new AuthController(database, configuration, new AuthHelper());
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
                Name = "test",
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
        public async Task InvalidPassword()
        {
            var registerResults = await authController.Register(new UserDTO()
            {
                Email = "test@gmail.com",
                Name = "test",
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
                Name = "test",
                Password = "testpass"
            });

            Assert.IsFalse(registerResults.Success);
        }   
    }
}
