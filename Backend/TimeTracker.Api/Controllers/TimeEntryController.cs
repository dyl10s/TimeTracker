using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TimeTracker.Api.Database;
using TimeTracker.Api.Database.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TimeEntryController : ControllerBase
    {
        MainDb database;

        public TimeEntryController(MainDb db)
        {
            database = db;
        }

        /// <summary>
        /// Get a list of all time entries
        /// </summary>
        /// <returns>A list of all time entries</returns>
        [HttpGet]
        public async Task<List<TimeEntry>> Get()
        {
            return await database.TimeEntries.ToListAsync();
        }


        /// <summary>
        /// Create a new time entry
        /// </summary>
        /// <param name="newEntry">New time entry to create</param>
        /// <returns>The time entry that was entered</returns>
        [HttpPost]
        public async Task<TimeEntry> Post(TimeEntry newEntry)
        {
            database.TimeEntries.Add(newEntry);
            await database.SaveChangesAsync();
            return newEntry;
        }
    }
}
