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
    public class ReportTests : BaseTest
    {
        TimeEntryController timeEntryController;
        ProjectController projectController;
        ReportController reportController;

        public ReportTests()
        {
            timeEntryController = new TimeEntryController(database, new AuthHelper());
            projectController = new ProjectController(database, new AuthHelper());
            reportController = new ReportController(database, new AuthHelper());

            TestAuthHelpers.LogInUser(database, configuration, new List<ControllerBase>() 
            {
                timeEntryController,
                projectController,
                reportController
            }).GetAwaiter().GetResult(); 
        }

        private async Task<int> setupTest()
        {
            // Create a project and time entry
            var mainProject = await projectController.CreateProject(new ProjectCreateDTO()
            {
                ClientName = "Spongebob Squarepants",
                Description = "Eat spongebob's pineapple house",
                ProjectName = "Eat Pineapple",
                Tags = new List<string>()
                {
                    "Food"
                }
            });

            var timeEntries = new List<TimeEntryDTO>()
            {
                new TimeEntryDTO()
                {
                    CreatedTime = DateTime.Now,
                    Day = new DateTime(1999, 1, 10),
                    Length = 5,
                    Notes = "Consumed leafs",
                    ProjectId = mainProject.Data
                },
                new TimeEntryDTO()
                {
                    CreatedTime = DateTime.Now,
                    Day = new DateTime(1999, 1, 10),
                    Length = 2,
                    Notes = "Consumed Door",
                    ProjectId = mainProject.Data
                },
                new TimeEntryDTO()
                {
                    CreatedTime = DateTime.Now,
                    Day = new DateTime(1999, 1, 10),
                    Length = 3,
                    Notes = "Consumed back of pineapple",
                    ProjectId = mainProject.Data
                }
            };

            foreach(var entry in timeEntries)
            {
                await timeEntryController.CreateTime(entry);
            }

            // Get project invite code
            var projectDetails = await projectController.GetProjectById(mainProject.Data);

            // Login as 2nd user
            TestAuthHelpers.LogInUser(database, configuration, new List<ControllerBase>() 
            {
                timeEntryController,
                projectController,
                reportController
            }, projectDetails.Data.InviteCode).GetAwaiter().GetResult(); 

            var timeEntries2 = new List<TimeEntryDTO>()
            {
                new TimeEntryDTO()
                {
                    CreatedTime = DateTime.Now,
                    Day = new DateTime(2000, 1, 10),
                    Length = 1,
                    Notes = "Consumed left window",
                    ProjectId = mainProject.Data
                },
                new TimeEntryDTO()
                {
                    CreatedTime = DateTime.Now,
                    Day = new DateTime(2000, 1, 10),
                    Length = 1,
                    Notes = "Consumed right window",
                    ProjectId = mainProject.Data
                }
            };

            foreach(var entry in timeEntries2)
            {
                await timeEntryController.CreateTime(entry);
            }

            return mainProject.Data;
        }

        [TestMethod]
        public async Task GetAllUserTimeEntriesOnAProject()
        {
            var projectId = await setupTest();

            // Get report
            var report = await reportController.GetAllUserTimeEntries(projectId, new DateTime(1998, 1, 1), new DateTime(2001, 1, 1));
        
            Assert.IsTrue(report.Success);
            // Should have 2 users
            Assert.AreEqual(2, report.Data.Count);

            // Should either be the first or 2nd persons time entries
            Assert.IsTrue(report.Data[0].TimeEntries.Count == 2 || report.Data[0].TimeEntries.Count == 3);
            Assert.IsTrue(report.Data[1].TimeEntries.Count == 2 || report.Data[1].TimeEntries.Count == 3);

            // Get report with only some entries
            var report2 = await reportController.GetAllUserTimeEntries(projectId, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
        
            Assert.IsTrue(report2.Success);
            // Should have 2 users
            Assert.AreEqual(2, report2.Data.Count);

            // Should either be the first or 2nd persons time entries
            Assert.IsTrue(report2.Data[0].TimeEntries.Count == 2 || report2.Data[0].TimeEntries.Count == 0);
            Assert.IsTrue(report2.Data[1].TimeEntries.Count == 2 || report2.Data[1].TimeEntries.Count == 0);

            // Invalid project should error
            var failedReport = await reportController.GetAllUserTimeEntries(-1, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
            Assert.IsFalse(failedReport.Success);
        }

        [TestMethod]
        public async Task GetAllUserTimeEntriesLengthOnAProject()
        {
            var projectId = await setupTest();

            // Get report
            var report = await reportController.GetAllUserTimeEntryLength(projectId, new DateTime(1998, 1, 1), new DateTime(2001, 1, 1));
            var multiReport = await reportController.GetAllUserTimeEntryLength(new int[] { projectId }, new DateTime(1998, 1, 1), new DateTime(2001, 1, 1));
        
            Assert.IsTrue(report.Success);
            Assert.IsTrue(multiReport.Success);
            // Should have 2 users
            Assert.AreEqual(2, report.Data.Count);
            Assert.AreEqual(2, multiReport.Data[0].UserTimeEntries.Count);

            // Should either be the first or 2nd persons time entries
            Assert.IsTrue(report.Data[0].Hours == 10 || report.Data[0].Hours == 2);
            Assert.IsTrue(report.Data[1].Hours == 10 || report.Data[1].Hours == 2);

            Assert.IsTrue(multiReport.Data[0].UserTimeEntries[0].Hours == 10 || multiReport.Data[0].UserTimeEntries[0].Hours == 2);
            Assert.IsTrue(multiReport.Data[0].UserTimeEntries[1].Hours == 10 || multiReport.Data[0].UserTimeEntries[1].Hours == 2);

            // Get report with only some entries
            var report2 = await reportController.GetAllUserTimeEntryLength(projectId, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
            var multiReport2 = await reportController.GetAllUserTimeEntryLength(new int[] { projectId }, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
        
            Assert.IsTrue(report2.Success);
            Assert.IsTrue(multiReport2.Success);

            // Should have 2 users
            Assert.AreEqual(2, report2.Data.Count);
            Assert.AreEqual(2, multiReport2.Data[0].UserTimeEntries.Count);

            // Should either be the first or 2nd persons time entries
            Assert.IsTrue(report2.Data[0].Hours == 2 || report2.Data[0].Hours == 0);
            Assert.IsTrue(report2.Data[1].Hours == 2 || report2.Data[1].Hours == 0);

            Assert.IsTrue(multiReport2.Data[0].UserTimeEntries[0].Hours == 2 || multiReport2.Data[0].UserTimeEntries[0].Hours == 0);
            Assert.IsTrue(multiReport2.Data[0].UserTimeEntries[1].Hours == 2 || multiReport2.Data[0].UserTimeEntries[1].Hours == 0);

            // Invalid project should error or be blank
            var failedReport = await reportController.GetAllUserTimeEntryLength(-1, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
            var failedMutliReport = await reportController.GetAllUserTimeEntryLength(new int[] { -1 }, new DateTime(2000, 1, 1), new DateTime(2001, 1, 1));
            
            Assert.IsFalse(failedReport.Success);
            Assert.AreEqual(0, failedMutliReport.Data.Count);
        }
    }
}
