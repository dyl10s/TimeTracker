# Time Tracker

## Development Setup

### Install Postgres

To start off you will need to download the database for local development. You can do so at the link [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). We are using Postgres 13 you can install the latest patch for version 13, at this time it is `13.1`. When installing all the defaults should be kept the same. To make the development process as smooth as possible set your default database password to `admin`. You can also skip the installation for stack builder on the last step.

### Install .Net 5

Next up you will need the framework that the backend runs with. You can install the latest .Net 5 version at this moment it is `5.0.2`. You can find the SDK download [here](https://dotnet.microsoft.com/download/dotnet/5.0).

### Install Entity Framework Tools

This software is using a code-first approach to database development which means you do not have to worry about writing any SQL. In order to use the tools after installing .Net 5 you can run the command `dotnet tool install --global dotnet-ef`.

### Install NodeJS and Angular

The front end is built off of Angular and node.js so you will need to install the node.js installer. You can find the find the correct installer for your system [here](https://nodejs.org/en/download/). After NodeJS is installed, you can also install the Angular CLI. Run the command `npm install -g @angular/cli`.

### Install node_modules

To get the front end built and ready for local development, you need to install the `node_modules`. To do this, open up the Frontend folder inside of a terminal and run `npm install`. This will install all correct packages and you can now run `ng serve` to get the Angular app running on `http://localhost:4200`.

## Development Tips

### Database

#### EF Core Overview

As stated earlier this project is using a code first approach which means you should never go and modify the database directly. The database is controlled by `Migrations`. They can be found in `/backend/TimeTracker.Database/Migrations`. Migrations are auto-generated by .Net and should only be changed in certain circumstances which this readme will not go into. The database "schema" can be found in the `/backend/TimeTracker.Database/Models` directory. Each file here represents a table in the database.

#### Updating the database

If you want to add a new item, you can start by creating a new class in the `/backend/TimeTracker.Database/Models` directory. Below you can find an example:

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
Each model should have an Id property which automatically increments by 1 each time an item is added to the database. In the class you can put any standard datatype or a reference to another class which would automatically create a relationship in the database. After you have finished creating the class with the required values you can run the follow command from the `/backend/TimeTracker.Database` directory `dotnet ef migrations add YOUR_MIGRATION_NAME --startup-project ../TimeTracker.Api`. The migration name can just be a small description of your change like `AddedTimeEntry`. 

When making a change to the database simply change the model file and run the same command `dotnet ef migrations add YOUR_MIGRATION_NAME --startup-project ../TimeTracker.Api`. 

The next time the app is run all migrations will be applied automatically to the database.

## Discord Bot Secrets

In order to keep the discord token private, we are using a build in .net solution called user secrets. The application will run without the secret and will just not run the discord bot. If you would like to additional discord bot development you will need to add a user secret in vscode. You can install the extension and follow their instructions to edit the user secrets on the `TimeTracker.Api.csproj` project. You can find the vscode extension [here](https://marketplace.visualstudio.com/items?itemName=adrianwilczynski.user-secrets).

After installing the extension, right click on `/backend/TimeTracker.Api/TimeTracker.Api.csproj` and select `Manage User Secrets`. The secret should be in the following format.

```json
{
  "BotToken": "BotTokenHere"
}
```

You can reach out to one of the existing developers to get the bot development token or create your own bot for local development [here](https://discord.com/developers/applications).