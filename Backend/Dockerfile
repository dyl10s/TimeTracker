FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
COPY ["TimeTracker.Api/TimeTracker.Api.csproj", "./TimeTracker.Api/"]
COPY ["TimeTracker.Database/TimeTracker.Database.csproj", "./TimeTracker.Database/"]
COPY ["TimeTracker.Discord/TimeTracker.Discord.csproj", "./TimeTracker.Discord/"]
RUN dotnet restore "TimeTracker.Database/TimeTracker.Database.csproj"
RUN dotnet restore "TimeTracker.Discord/TimeTracker.Discord.csproj"
RUN dotnet restore "TimeTracker.Api/TimeTracker.Api.csproj"
COPY . .

WORKDIR /src
RUN dotnet build "TimeTracker.Api/TimeTracker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TimeTracker.Api/TimeTracker.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "TimeTracker.Api.dll"]