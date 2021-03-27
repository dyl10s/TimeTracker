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

        // returns a TimerDTO for the newly created Timer
        [HttpPost]
        [Route("Start")]
        public async Task<GenericResponseDTO<TimerDTO>> StartTimer(TimerCreateDTO timerInfo) {

            User currentUser = await authHelper.GetCurrentUser(User, database);

            Project project = await database.Projects
                .AsQueryable()
                .FirstOrDefaultAsync(
                    p => p.Id == timerInfo.ProjectId && 
                    (p.Students.Any(s => s.Id == currentUser.Id) || p.Teacher.Id == currentUser.Id));

            if(project == null) {
                return new GenericResponseDTO<TimerDTO> {
                    Message = "Could not find project.",
                    Success = false
                };
            }

            Timer timer = (await database.Timers
                .AddAsync(new Timer {
                    User = await authHelper.GetCurrentUser(User, database),
                    StartTime = DateTime.UtcNow,
                    Notes = timerInfo.Notes,
                    Project = project
                })).Entity;

            await database.SaveChangesAsync();

            return new GenericResponseDTO<TimerDTO> {
                Data = new TimerDTO {
                    Id = timer.Id,
                    StartTime = timer.StartTime,
                    Notes = timer.Notes,
                    ProjectId = timer.Project.Id
                },
                Success = true
            };
            
        }

        // returns a TimeEntryDTO for the newly created TimeEntry
        [HttpPost]
        [Route("Stop")]
        public async Task<GenericResponseDTO<TimeEntryDTO>> StopTimer(int timerId) {

            Timer timer = await database.Timers
                .AsQueryable()
                .Where(t => t.User.Id == authHelper.GetCurrentUserId(User))
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == timerId);

            DateTime timeEntryCreationTime = DateTime.UtcNow;

            TimeEntry timeEntry = (await database.TimeEntries
                .AddAsync(new TimeEntry{
                    CreatedTime = timeEntryCreationTime,
                    Notes = timer.Notes,
                    Project = timer.Project,
                    LastModified = timeEntryCreationTime,
                    User = await authHelper.GetCurrentUser(User, database),
                    Length = (timeEntryCreationTime - timer.StartTime).TotalMinutes,
                    Day = timeEntryCreationTime
                })).Entity;

            TimeEntryDTO returnData = new TimeEntryDTO {
                Id = timeEntry.Id,
                Length = timeEntry.Length,
                Notes = timeEntry.Notes,
                ProjectId = timer.Project.Id,
                Day = timeEntry.Day
            };

            database.Timers.Remove(timer);

            await database.SaveChangesAsync();

            return new GenericResponseDTO<TimeEntryDTO> {
                Success = true,
                Data = returnData
            };
        }

        // returns a TimerDTO for the given timer id
        [HttpPost]
        public async Task<GenericResponseDTO<TimerDTO>> GetTimerById(int timerId) {
            
            if(User == null) {
                return new GenericResponseDTO<TimerDTO> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            Timer timer = await database.Timers
                .AsNoTracking()
                .Where(t => t.User.Id == authHelper.GetCurrentUserId(User))
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == timerId);

            if(timer == null) {
                return new GenericResponseDTO<TimerDTO> {
                    Message = "Could not find timer with a matching Id.",
                    Success = false
                };
            }

            return new GenericResponseDTO<TimerDTO> {
                Data = new TimerDTO{
                    Id = timer.Id,
                    StartTime = timer.StartTime,
                    Notes = timer.Notes,
                    ProjectId = timer.Project.Id 
                },
                Success = true
            };
            
        }

        // returns a list of timerDTOs for each timer belonging to the logged in user
        [HttpGet]
        public async Task<GenericResponseDTO<List<TimerDTO>>> GetAllTimers() {

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
                .Include(t => t.Project)
                .ToListAsync();

            List<TimerDTO> timerDTOs = new List<TimerDTO>();
            timers.ForEach(t => timerDTOs.Add(new TimerDTO {
                Id = t.Id,
                StartTime = t.StartTime,
                Notes = t.Notes,
                ProjectId = t.Project.Id
            }));

            return new GenericResponseDTO<List<TimerDTO>> {
                Data = timerDTOs,
                Success = true
            };
        }

        // returns a list of timerDTOs for each timer belonging to the logged in user
        [HttpGet]
        [Route("DateRange")]
        public async Task<GenericResponseDTO<List<TimerDTO>>> GetTimersWithinDateRange(DateTime startDate, DateTime endDate) {

            int currentUserId;

            try {
                currentUserId = authHelper.GetCurrentUserId(User);
            } catch(System.NullReferenceException) {
                return new GenericResponseDTO<List<TimerDTO>> {
                    Message = "Not logged in.",
                    Success = false
                };
            }

            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59);

            List<Timer> timers = await database.Timers
                .AsNoTracking()
                .Where(t => t.User.Id == currentUserId && t.StartTime >= startDate && t.StartTime <= endDate)
                .Include(t => t.Project)
                .ToListAsync();

            List<TimerDTO> timerDTOs = new List<TimerDTO>();
            timers.ForEach(t => timerDTOs.Add(new TimerDTO {
                Id = t.Id,
                StartTime = t.StartTime,
                Notes = t.Notes,
                ProjectId = t.Project.Id
            }));

            return new GenericResponseDTO<List<TimerDTO>> {
                Data = timerDTOs,
                Success = true
            };
        }
    }
}