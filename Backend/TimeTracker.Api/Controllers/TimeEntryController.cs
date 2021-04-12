using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TimeTracker.Api.DTOs;
using TimeTracker.Api.Helpers;
using TimeTracker.Database;
using TimeTracker.Database.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TimeEntryController : ControllerBase
    {
        MainDb database;
        AuthHelper authHelper;

        public TimeEntryController(MainDb db, AuthHelper auth)
        {
            database = db;
            authHelper = auth;
        }

        /// <summary>
        /// Get a list of all time entries
        /// </summary>
        /// <returns>A list of all time entries</returns>
        [HttpGet("{id}")]
        public async Task<GenericResponseDTO<TimeEntry>> Get(int id)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            var entry = await database.TimeEntries
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.User.Id == currentUserId);

            if(entry == null)
            {
                return new GenericResponseDTO<TimeEntry>()
                {
                    Message = "Could not find the specified project",
                    Success = false
                };
            }

            return new GenericResponseDTO<TimeEntry>()
                {
                    Data = entry,
                    Success = true
                };
        }

        [HttpGet]
        public async Task<GenericResponseDTO<List<TimeEntry>>> GetInDateRange(DateTime startDate, DateTime endDate)
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            // Set times to beginning and end of days
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59);

            var entries = await database.TimeEntries
                .AsNoTracking()
                .Where(x => x.User.Id == currentUserId && x.Day >= startDate && x.Day <= endDate)
                .Include(x => x.Project)
                .ToListAsync();

            return new GenericResponseDTO<List<TimeEntry>>()
            {
                Data = entries,
                Success = true
            };
        }


        /// <summary>
        /// Create a new time entry
        /// </summary>
        /// <param name="data">New time entry to create</param>
        /// <returns>The time entry that was entered</returns>
        [HttpPost]
        public async Task<GenericResponseDTO<int>> CreateTime(TimeEntryDTO data)
        {
            var results = new GenericResponseDTO<int>() 
            { 
                Success = true  
            };

            var newTimeEntry = new TimeEntry() 
            { 
                CreatedTime = DateTime.UtcNow,
                Day = data.Day,
                LastModified = DateTime.UtcNow,
                Length = data.Length,
                Notes = data.Notes,
                Project = await database.Projects.AsQueryable().SingleAsync(x => x.Id == data.ProjectId),
                User = await authHelper.GetCurrentUser(User, database)
            };

            database.TimeEntries.Add(newTimeEntry);
            await database.SaveChangesAsync();
            results.Data = newTimeEntry.Id;
            return results;
        }

        [HttpPatch]
        public async Task<GenericResponseDTO<TimeEntry>> UpdateTime(TimeEntryDTO data)
        {
            var results = new GenericResponseDTO<TimeEntry>() 
            { 
                Success = true  
            };

            var currentUserId = authHelper.GetCurrentUserId(User);
            var currentTimeEntry = await database
                .TimeEntries
                .AsQueryable()
                .SingleOrDefaultAsync(x => x.Id == data.Id && x.User.Id == currentUserId);

            if(currentTimeEntry == null)
            {
                results.Success = false;
                results.Message = "Could not find the specified time entry";
                return results;
            }

            currentTimeEntry.Day = data.Day;
            currentTimeEntry.Length = data.Length;
            currentTimeEntry.Notes = data.Notes;
            currentTimeEntry.Day = data.Day;
            currentTimeEntry.LastModified = DateTime.UtcNow;

            await database.SaveChangesAsync();

            results.Data = currentTimeEntry;
            return results;
        }

        /// <summary>
        /// Deletes a time entry
        /// </summary>
        /// <returns>The ID of the deleted entry</returns>
        [HttpDelete("{id}")]
        public async Task<GenericResponseDTO<int>> DeleteTimeEntry(int id) 
        {
            var currentUserId = authHelper.GetCurrentUserId(User);

            var results = new GenericResponseDTO<int>() {
                Success = false
            };

            var entry = await database.TimeEntries
                .AsQueryable()
                .SingleOrDefaultAsync(x => x.User.Id == currentUserId && x.Id == id);
            
            if(entry == null) {
                results.Message = "Could not find the Time Entry";
                return results;
            }

            database.TimeEntries.Remove(entry);

            await database.SaveChangesAsync();

            results.Success = true;
            results.Data = entry.Id;
            return results;
        }

    }
}
