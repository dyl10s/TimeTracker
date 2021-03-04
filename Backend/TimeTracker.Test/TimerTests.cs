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
using Microsoft.EntityFrameworkCore;
using TimeTracker.Api.Database.Models;

namespace TimeTracker.Test {

    [TestClass]
    public class TimerTests : BaseTest {

        TimerController timerController;
        AuthHelper authHelper;
        ProjectController projectController;
        List<ControllerBase> controllers;

        public TimerTests() {
            controllers = new List<ControllerBase>();
            authHelper = new AuthHelper();
            timerController = new TimerController(database, authHelper);
            projectController = new ProjectController(database, authHelper);
            controllers.Add(timerController);
            controllers.Add(projectController);
        }

        [TestMethod]
        public async Task StartAndStopTimerTest() {

            await TestAuthHelpers.LogInUser(database, configuration, controllers);

            GenericResponseDTO<int> projectCreationResponse = await projectController.CreateProject(new ProjectCreateDTO{
                ProjectName = "A Cool Project",
                ClientName = "Misha",
                Tags = new List<string>(),
                Description = "A very cool Project"
            });

            Project project = (await database.Projects
                .FirstOrDefaultAsync(p => p.Id == projectCreationResponse.Data));

            project.Students
                .Add(project.Teacher);

            await database.SaveChangesAsync();

            int projectId = projectCreationResponse.Data;

            GenericResponseDTO<TimerDTO> startTimerResponse = await timerController.StartTimer(new TimerCreateDTO {
                Notes = "Working on stuff",
                ProjectId = projectId
            });

            Assert.IsTrue(startTimerResponse.Success);
            Assert.AreEqual(startTimerResponse.Data.Notes, "Working on stuff");
            Assert.AreEqual(startTimerResponse.Data.ProjectId, projectId);

            GenericResponseDTO<List<TimerDTO>> getTimersResponse = await timerController.GetAllTimers();

            List<TimerDTO> timers = getTimersResponse.Data;

            Assert.AreEqual(timers.Count, 1);
            Assert.AreEqual(timers[0].ProjectId, projectId);
            Assert.IsTrue(timers[0].Notes.SequenceEqual("Working on stuff"));
            Assert.AreEqual(timers[0].StartTime, startTimerResponse.Data.StartTime);

            GenericResponseDTO<TimeEntryDTO> stopTimerResponse = await timerController.StopTimer(timers[0].Id);
            DateTime responseGottenTime = DateTime.UtcNow;

            Assert.IsTrue(stopTimerResponse.Success);
            Assert.IsTrue(stopTimerResponse.Data.ProjectId == projectId);
            Assert.AreEqual(stopTimerResponse.Data.Notes, "Working on stuff");
            Assert.AreEqual((responseGottenTime - stopTimerResponse.Data.Day).Minutes, 0);

            getTimersResponse = await timerController.GetAllTimers();

            Assert.AreEqual(getTimersResponse.Data.Count, 0);
        }

        [TestMethod]
        public async Task GetTimerByIdTest() {

            await TestAuthHelpers.LogInUser(database, configuration, controllers);

            GenericResponseDTO<int> projectCreationResponse = await projectController.CreateProject(new ProjectCreateDTO{
                ProjectName = "Another Cool Project",
                ClientName = "Tristam",
                Tags = new List<string>(),
                Description = "An even COOLER project :)"
            });

            Project project = (await database.Projects
                .FirstOrDefaultAsync(p => p.Id == projectCreationResponse.Data));

            project.Students
                .Add(project.Teacher);

            await database.SaveChangesAsync();

            int projectId = projectCreationResponse.Data;

            GenericResponseDTO<TimerDTO> startTimerResponse = await timerController.StartTimer(new TimerCreateDTO {
                Notes = "Working on things",
                ProjectId = projectId
            });

            Assert.IsTrue(startTimerResponse.Success);

            GenericResponseDTO<TimerDTO> getTimerByIdResponse = await timerController.GetTimerById(startTimerResponse.Data.Id);

            Assert.IsTrue(getTimerByIdResponse.Success);
            Assert.AreEqual(getTimerByIdResponse.Data.Id, startTimerResponse.Data.Id);
            Assert.AreEqual(getTimerByIdResponse.Data.Notes, "Working on things");
            Assert.AreEqual(getTimerByIdResponse.Data.ProjectId, projectId);
            Assert.AreEqual(getTimerByIdResponse.Data.StartTime, startTimerResponse.Data.StartTime);
        }

        [TestMethod]
        public async Task GetTimerWithinDateRangeTest() {

            await TestAuthHelpers.LogInUser(database, configuration, controllers);

            GenericResponseDTO<int> projectCreationResponse = await projectController.CreateProject(new ProjectCreateDTO{
                ProjectName = "One MORE Cool Project",
                ClientName = "Benjamin",
                Tags = new List<string>(),
                Description = "Not a very cool project"
            });

            Project project = (await database.Projects
                .FirstOrDefaultAsync(p => p.Id == projectCreationResponse.Data));

            project.Students
                .Add(project.Teacher);

            await database.SaveChangesAsync();

            int projectId = projectCreationResponse.Data;

            GenericResponseDTO<TimerDTO> startTimerResponse = await timerController.StartTimer(new TimerCreateDTO {
                Notes = "Didn't really do anything",
                ProjectId = projectId
            });

            Assert.IsTrue(startTimerResponse.Success);

            GenericResponseDTO<List<TimerDTO>> getTimerByIdResponse = await timerController.GetTimersWithinDateRange(DateTime.UtcNow - new TimeSpan(1, 0, 0), DateTime.UtcNow);

            Assert.IsTrue(getTimerByIdResponse.Success);
            Assert.AreEqual(getTimerByIdResponse.Data[0].Id, startTimerResponse.Data.Id);
            Assert.AreEqual(getTimerByIdResponse.Data[0].Notes, "Didn't really do anything");
            Assert.AreEqual(getTimerByIdResponse.Data[0].ProjectId, projectId);
            Assert.AreEqual(getTimerByIdResponse.Data[0].StartTime, startTimerResponse.Data.StartTime);

            getTimerByIdResponse = await timerController.GetTimersWithinDateRange(DateTime.UtcNow, DateTime.UtcNow);

            Assert.AreEqual(getTimerByIdResponse.Data.Count, 0);
        }
    }
}