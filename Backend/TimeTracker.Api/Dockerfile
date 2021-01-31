FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
COPY ["TimeTracker.Api.csproj", "./"]
RUN dotnet restore "TimeTracker.Api.csproj"
COPY . .

WORKDIR /src
RUN dotnet build "TimeTracker.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TimeTracker.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "TimeTracker.Api.dll"]
