import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateTagDTO } from '../models/CreateTagDTO.model';
import { ProjectCreateDTO } from '../models/ProjectCreateDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  public getProjectById(id: number) {
    return this.http.get(`${this.api}/Project/${id}`);
  }

  public getProjectsByUser() {
    return this.http.get(`${this.api}/Project`);
  }

  public addTagToProject(newTagInfo: CreateTagDTO) {
    return this.http.post(`${this.api}/Project/Tag`, newTagInfo);
  }

  public setProjectTags(newTagsInfo: CreateTagDTO[]) {
    return this.http.post(`${this.api}/Project/Tags`, newTagsInfo);
  }

  public createProject(projectCreateInfo: ProjectCreateDTO) {
    return this.http.post(`${this.api}/Project`, projectCreateInfo);
  }

  public updateProjectDetails(description: string, projectId: number) {
    return this.http.patch(`${this.api}/Project`, { description, projectId })
  }

}
