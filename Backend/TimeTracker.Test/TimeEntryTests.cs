using Backend.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimeTracker.Api.Controllers;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Test.Helpers;

namespace TimeTracker.Test
{
    [TestClass]
    public class TimeEntryTests : BaseTest
    {
        TimeEntryController timeEntryController;
        ProjectController projectController;

        public TimeEntryTests()
        {
            timeEntryController = new TimeEntryController(database, new AuthHelper());
            projectController = new ProjectController(database, new AuthHelper());

            TestAuthHelpers.LogInUser(database, configuration, new List<ControllerBase>() 
            {
                timeEntryController,
                projectController
            }).GetAwaiter().GetResult(); 
        }

        [TestMethod]
        public async Task TestTimeEntry()
        {
            var projectResults = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Test Client",
                Description = "Test Desciption",
                ProjectName = "Best project 10/10",
                Tags = new List<string>() { "AngryCarrot" }
            });
            
            database.ChangeTracker.Clear();

            var projectId = projectResults.Data;

            var testTimeEntry = new TimeEntryDTO() 
            { 
                Day = new DateTime(1999, 6, 18),
                Length = 5,
                Notes = "Happy Birthday",
                ProjectId = projectId
            };

            // Create time
            var createTimeResults = await timeEntryController.CreateTime(testTimeEntry);

            Assert.IsTrue(createTimeResults.Success);
            Assert.IsTrue(createTimeResults.Data > 0);

            // Get the time entry
            var getCreatedTimeResults = await timeEntryController.Get(createTimeResults.Data);

            Assert.AreEqual(getCreatedTimeResults.Success, true);
            Assert.AreEqual(testTimeEntry.Day, getCreatedTimeResults.Data.Day);
            Assert.AreEqual(testTimeEntry.Length, getCreatedTimeResults.Data.Length);
            Assert.AreEqual(testTimeEntry.Notes, getCreatedTimeResults.Data.Notes);
            Assert.IsTrue(DateTime.UtcNow > getCreatedTimeResults.Data.CreatedTime);

            var updatedTimeEntry = new TimeEntryDTO()
            { 
                Id = createTimeResults.Data,
                Day = new DateTime(1989, 10, 24),
                Notes = "pewdiepie",
                Length = 5
            };

            // Update time
            var updateTimeResuls = await timeEntryController.UpdateTime(updatedTimeEntry);

            // Get the time entry
            var getUpdatedTimeResults = await timeEntryController.Get(updateTimeResuls.Data);

            Assert.AreEqual(getUpdatedTimeResults.Success, true);
            Assert.AreEqual(getUpdatedTimeResults.Data.Id, getCreatedTimeResults.Data.Id);
            Assert.AreEqual(updatedTimeEntry.Day, getUpdatedTimeResults.Data.Day);
            Assert.AreEqual(updatedTimeEntry.Length, getUpdatedTimeResults.Data.Length);
            Assert.AreEqual(updatedTimeEntry.Notes, getUpdatedTimeResults.Data.Notes);
            Assert.AreEqual(getUpdatedTimeResults.Data.CreatedTime, getCreatedTimeResults.Data.CreatedTime);
            Assert.IsTrue(getCreatedTimeResults.Data.LastModified < getUpdatedTimeResults.Data.LastModified);

            // Search for projects

            var singleDayNoResults = await timeEntryController.GetInDateRange(DateTime.Now, DateTime.Now);

            Assert.AreEqual(singleDayNoResults.Success, true);
            Assert.AreEqual(singleDayNoResults.Data.Count, 0);

            var singleDayResults = await timeEntryController.GetInDateRange(updatedTimeEntry.Day, updatedTimeEntry.Day);

            Assert.AreEqual(singleDayResults.Success, true);
            Assert.AreEqual(singleDayResults.Data.Count, 1);

            var multipleDayResults = await timeEntryController.GetInDateRange(updatedTimeEntry.Day.AddDays(-10), updatedTimeEntry.Day.AddDays(123));

            Assert.AreEqual(multipleDayResults.Success, true);
            Assert.AreEqual(multipleDayResults.Data.Count, 1);
        }
    }
}
