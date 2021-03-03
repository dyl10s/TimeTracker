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

            int projectId = projectCreationResponse.Data;

            GenericResponseDTO<TimerDTO> startTimerResponse = await timerController.StartTimer(new TimerCreateDTO {
                Notes = "Working on stuff",
                ProjectId = projectId
            });

            Assert.IsTrue(startTimerResponse.Success);
            Assert.IsTrue(startTimerResponse.Data.Notes.SequenceEqual("Working on stuff"));
            Assert.AreEqual(startTimerResponse.Data.ProjectId, projectId);

            GenericResponseDTO<List<TimerDTO>> getTimersResponse = await timerController.GetAllTimers();

            List<TimerDTO> timers = getTimersResponse.Data;

            Assert.AreEqual(timers.Count, 1);
            Assert.AreEqual(timers[0].ProjectId, projectId);
            Assert.IsTrue(timers[0].Notes.SequenceEqual("Working on stuff"));
            Assert.AreEqual(timers[0].StartTime, startTimerResponse.Data.StartTime);

            GenericResponseDTO<TimeEntryDTO> stopTimerResponse = await timerController.StopTimer(timers[0].Id);
            DateTime responseGottenTime = DateTime.Now;

            Assert.IsTrue(stopTimerResponse.Success);
            Assert.IsTrue(stopTimerResponse.Data.ProjectId == projectId);
            Assert.IsTrue(stopTimerResponse.Data.Notes.SequenceEqual("Working on stuff"));
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

            int projectId = projectCreationResponse.Data;

            GenericResponseDTO<TimerDTO> startTimerResponse = await timerController.StartTimer(new TimerCreateDTO {
                Notes = "Working on things",
                ProjectId = projectId
            });

            Assert.IsTrue(startTimerResponse.Success);

            GenericResponseDTO<TimerDTO> getTimerByIdResponse = await timerController.GetTimerById(startTimerResponse.Data.Id);

            Assert.IsTrue(getTimerByIdResponse.Success);
            Assert.AreEqual(getTimerByIdResponse.Data.Id, startTimerResponse.Data.Id);
            Assert.IsTrue(getTimerByIdResponse.Data.Notes.SequenceEqual("Working on things"));
            Assert.AreEqual(getTimerByIdResponse.Data.ProjectId, projectId);
            Assert.AreEqual(getTimerByIdResponse.Data.StartTime, startTimerResponse.Data.StartTime);
        }
    }
}