# Time Tracker

## Development Setup

### Install Postgres

To start off you will need to download the database for local development. You can do so at the link [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). We are using Postgres 13 you can install the latest patch for version 13, at this time it is `13.1`. When installing all the defaults should be kept the same. To make the development process as smooth as possible set your default database password to `admin`. You can also skip the installation for stack builder on the last step.

### Install .Net Core 5

Next up you will need the framework that the backend runs with. You can install the latest .Net Core 5 version at this moment it is `5.0.2`. You can find the SDK download [here](https://dotnet.microsoft.com/download/dotnet/5.0).

### Install Entity Framework Tools

This software is using a code-first approach to database development which means you do not have to worry about writing any SQL. In order to use the tools after installing .Net Core 5 you can run the command `dotnet tool install --global dotnet-ef`.

## Development Tips

### Database

#### EF Core Overview

As stated earlier this project is using a code first approach which means you should never go and modify the database directly. The database is controlled by `Migrations`. They can be found in `/backend/TimeTracker.Api/Migrations`. Migrations are auto-generated by .Net and should only be changed in certain circumstances which this readme will not go into. The database "schema" can be found in the `/backend/TimeTracker.Api/Database/Models` directory. Each file here represents a table in the database.

#### Updating the database

If you want to add a new item, you can start by creating a new class in the `/backend/TimeTracker.Api/Database/Models` directory. Below you can find an example:

```c#
using System;

namespace TimeTracker.Api.Models
{
    public class TimeEntry
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set;}
        public DateTime EndTime { get; set; }
        public string Message { get; set;}
    }
}
```
Each model should have an Id property which automatically increments by 1 each time an item is added to the database. In the class you can put any standard datatype or a reference to another class which would automatically create a relationship in the database. After you have finished creating the class with the required values you can run the follow command from the `/backend/TimeTracker.Api` directory `dotnet ef migrations add YOUR_MIGRATION_NAME`. The migration name can just be a small description of your change like `AddedTimeEntry`. 

When making a change to the database simply change the model file and run the same command `dotnet ef migrations add YOUR_MIGRATION_NAME`. 

The next time the app is run all migrations will be applied automatically to the database.
