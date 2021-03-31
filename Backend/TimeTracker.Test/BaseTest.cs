using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TimeTracker.Database;

namespace TimeTracker.Test
{
    public class BaseTest
    {
        protected IConfiguration configuration;
        protected MainDb database;

        public BaseTest()
        {
            configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.development.json").Build();

            var connection = new SqliteConnection("DataSource=:memory:");
            var options = new DbContextOptionsBuilder<MainDb>()
                .UseSqlite(connection)
                .Options;

            database = new MainDb(options);
            database.Database.OpenConnection();
            database.Database.Migrate();
        }

        ~BaseTest()
        {
            database.Database.CloseConnection();
            database.Dispose();
        }
    }
}
