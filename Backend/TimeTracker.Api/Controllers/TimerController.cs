using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TimerController : ControllerBase {
        MainDb database;
        AuthHelper authHelper;

        public TimerController(MainDb db, AuthHelper auth)
        {
            database = db;
            authHelper = auth;
        }

        [HttpPost]
        public async Task<GenericResponseDTO<int>> startTimer(TimerCreateDTO timerInfo) {

            if(User == null) {
                return new GenericResponseDTO<int> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            Project project = await database.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == timerInfo.ProjectId);

            if(project == null) {
                return new GenericResponseDTO<int> {
                    Message = "Could not find project.",
                    Success = false
                };
            }

            await database.Timers
                .AddAsync(new Timer {
                    User = await authHelper.GetCurrentUser(User, database),
                    StartTime = DateTime.Now,
                    Notes = timerInfo.Notes,
                    Project = project
                });

            await database.SaveChangesAsync();

            return new GenericResponseDTO<int> {
                Success = true
            };
            
        }

        [HttpPost]
        [Route("Stop")]
        public async Task<GenericResponseDTO<int>> stopTimer(int timerId) {

            if(User == null) {
                return new GenericResponseDTO<int> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            Timer timer = await database.Timers
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == timerId);

            if(timer.User.Id != authHelper.GetCurrentUserId(User)) {
                return new GenericResponseDTO<int> {
                    Message = "Invalid user.",
                    Success = false
                };
            }

            DateTime timeEntryCreationTime = DateTime.Now;

            await database.TimeEntries.AddAsync(new TimeEntry{
                CreatedTime = timeEntryCreationTime,
                Notes = timer.Notes,
                Project = timer.Project,
                LastModified = timeEntryCreationTime,
                User = await authHelper.GetCurrentUser(User, database),
                Length = timeEntryCreationTime.Second - timer.StartTime.Second,
                Day = timeEntryCreationTime
            });

            await database.SaveChangesAsync();

            return new GenericResponseDTO<int> {
                Success = true
            };
        }

        [HttpGet]
        public async Task<GenericResponseDTO<List<TimerDTO>>> getAllTimers() {

            int currentUserId;

            try {
                currentUserId = authHelper.GetCurrentUserId(User);
            } catch(System.NullReferenceException) {
                return new GenericResponseDTO<List<TimerDTO>> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            List<Timer> timers = await database.Timers
                .AsNoTracking()
                .Where(t => t.User.Id == currentUserId)
                .ToListAsync();

            List<TimerDTO> timerDTOs = new List<TimerDTO>();
            timers.ForEach(t => timerDTOs.Add(new TimerDTO {
                Id = t.Id,
                StartTime = t.StartTime,
                Notes = t.Notes,
                ProjectName = t.Project.Name
            }));

            return new GenericResponseDTO<List<TimerDTO>> {
                Data = timerDTOs,
                Success = true
            };
        }
    }
}