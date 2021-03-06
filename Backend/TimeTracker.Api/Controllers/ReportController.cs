﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace TimeTracker.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        MainDb database;
        AuthHelper authHelper;
        
        public ReportController(MainDb database, AuthHelper authHelper) {
            this.database = database;
            this.authHelper = authHelper;
        }

        [Route("Details")]
        [HttpGet]
        public async Task<GenericResponseDTO<List<UserTimeEntriesDTO>>> GetAllUserTimeEntries(int projectId, DateTime startDate, DateTime endDate) 
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59, 999);

            var results = new GenericResponseDTO<List<UserTimeEntriesDTO>>()
            {
                Success = true
            };

            var loggedinUser = await authHelper.GetCurrentUser(User, database);

            var projectDetails = await database.Projects
                .AsNoTracking()
                .Where(x => x.Teacher.Id == loggedinUser.Id || x.Students.Contains(loggedinUser))
                .Where(x => x.Id == projectId)
                .Include(x => x.Students)
                .Include(x => x.Teacher)
                .FirstOrDefaultAsync();

            if(projectDetails == null)
            {
                results.Success = false;
                results.Message = "Project could not be found!";
                return results;
            }

            var usersInProject = new List<User>()
            {
                projectDetails.Teacher
            };

            foreach(var student in projectDetails.Students)
            {
                usersInProject.Add(student);
            }

            var timeEntries = await database.TimeEntries
                .AsNoTracking()
                .Where(x => x.Project.Id == projectId)
                .Where(x => usersInProject.Contains(x.User))
                .Where(x => x.Day >= startDate && x.Day <= endDate)
                .Include(x => x.Project)
                .Include(x => x.User)
                .ToListAsync();

            results.Data = new List<UserTimeEntriesDTO>();

            foreach(var projUser in usersInProject)
            {
                var entry = new UserTimeEntriesDTO()
                {
                    FirstName = projUser.FirstName,
                    LastName = projUser.LastName,
                    UserId = projUser.Id,
                    TimeEntries = new List<TimeEntryDTO>()
                };

                foreach(var timeEntry in timeEntries)
                {
                    if(timeEntry.User.Id == projUser.Id)
                    {
                        entry.TimeEntries.Add(new TimeEntryDTO()
                        {
                           Id = timeEntry.Id,
                           CreatedTime = timeEntry.CreatedTime,
                           Day = timeEntry.Day,
                           LastModified = timeEntry.LastModified,
                           Length = timeEntry.Length,
                           Notes = timeEntry.Notes,
                           ProjectId = timeEntry.Project.Id
                        });
                    }
                }

                results.Data.Add(entry);
            }

            return results;
        }
    
        [Route("Length")]
        [HttpGet]
        public async Task<GenericResponseDTO<List<UserTimeEntryLengthDTO>>> GetAllUserTimeEntryLength(int projectId, DateTime startDate, DateTime endDate) 
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59, 999);

            var results = new GenericResponseDTO<List<UserTimeEntryLengthDTO>>()
            {
                Success = true
            };

            var loggedinUser = await authHelper.GetCurrentUser(User, database);

            var projectDetails = await database.Projects
                .AsNoTracking()
                .Where(x => x.Teacher.Id == loggedinUser.Id || x.Students.Contains(loggedinUser))
                .Where(x => x.Id == projectId)
                .Include(x => x.Students)
                .Include(x => x.Teacher)
                .FirstOrDefaultAsync();
            
            if(projectDetails == null)
            {
                results.Success = false;
                results.Message = "Project could not be found!";
                return results;
            }

            var usersInProject = new List<User>()
            {
                projectDetails.Teacher
            };

            foreach(var student in projectDetails.Students)
            {
                usersInProject.Add(student);
            }

            var timeEntries = await database.TimeEntries
                .AsNoTracking()
                .Where(x => x.Project.Id == projectId)
                .Where(x => usersInProject.Contains(x.User))
                .Where(x => x.Day >= startDate && x.Day <= endDate)
                .Include(x => x.User)
                .ToListAsync();

            results.Data = new List<UserTimeEntryLengthDTO>();

            foreach(var projUser in usersInProject)
            {
                var entry = new UserTimeEntryLengthDTO()
                {
                    FirstName = projUser.FirstName,
                    LastName = projUser.LastName,
                    UserId = projUser.Id,
                    Hours = 0
                };

                foreach(var timeEntry in timeEntries)
                {
                    if(timeEntry.User.Id == projUser.Id)
                    {
                        entry.Hours += timeEntry.Length;
                    }
                }

                results.Data.Add(entry);
            }

            return results;
        }
    
        [Route("Lengths")]
        [HttpGet]
        public async Task<GenericResponseDTO<List<LengthReportDTO>>> GetAllUserTimeEntryLength([FromQuery] int[] projectIds, DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59, 999);

            var results = new GenericResponseDTO<List<LengthReportDTO>>()
            {
                Success = true
            };

            var loggedinUser = await authHelper.GetCurrentUser(User, database);

            var projectDetails = await database.Projects
                .AsNoTracking()
                .Where(x => x.Teacher.Id == loggedinUser.Id || x.Students.Contains(loggedinUser))
                .Where(x => projectIds.Contains(x.Id))
                .Include(x => x.Students)
                .Include(x => x.Teacher)
                .ToListAsync();

            // Create a list of all users we need time entries for
            var allUsersInResults = new List<(int, User)>();

            allUsersInResults.AddRange(projectDetails.Select(x => (x.Id, x.Teacher)));

            projectDetails.ForEach(p => {
                allUsersInResults.AddRange(p.Students.Select(x => (p.Id, x)));
            });
            
            // Remove duplicates
            allUsersInResults = allUsersInResults.Distinct().ToList();

            var timeEntries = await database.TimeEntries
                .AsNoTracking()
                .Where(x => projectIds.Contains(x.Project.Id))
                .Where(x => allUsersInResults.Select(x => x.Item2).Contains(x.User))
                .Where(x => x.Day >= startDate && x.Day <= endDate)
                .Include(x => x.User)
                .Include(x => x.Project)
                .ToListAsync();

            var timeEntriesByProjectId = timeEntries
                .GroupBy(x => x.Project.Id);
                
            results.Data = new List<LengthReportDTO>();

            // Create all the project report entries
            foreach(var project in projectDetails) {
                var lengthReport = new LengthReportDTO() {
                    ProjectId = project.Id,
                    UserTimeEntries = new List<UserTimeEntryLengthDTO>()
                };

                // Create all the user entries
                foreach(var userInProject in allUsersInResults.Where(x => x.Item1 == lengthReport.ProjectId)){
                    lengthReport.UserTimeEntries.Add(new UserTimeEntryLengthDTO() {
                        FirstName = userInProject.Item2.FirstName,
                        LastName = userInProject.Item2.LastName,
                        Hours = 0,
                        UserId = userInProject.Item2.Id
                    });
                }

                results.Data.Add(lengthReport);
            }

            // Generate the length report
            foreach(var timeEntryGroup in timeEntriesByProjectId) {

                var lengthReport = results.Data.First(x => x.ProjectId == timeEntryGroup.Key);

                // Add up the users hours
                foreach(var timeEntryByUser in timeEntryGroup.GroupBy(x => x.User.Id).Select(x => x)){
                    
                    // Find the user object
                    var userReport = lengthReport.UserTimeEntries.First(x => x.UserId == timeEntryByUser.Key);

                    foreach(var timeEntry in timeEntryByUser.Select(x => x)){
                        userReport.Hours += timeEntry.Length;
                    }
                }
            }

            return results;
        }
    }
}
