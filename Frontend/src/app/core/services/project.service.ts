import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateTagDTO } from '../models/CreateTagDTO.model';
import { ProjectCreateDTO } from '../models/ProjectCreateDTO.model';
import { UpdateProjectDTO } from '../models/UpdateProjectDTO.model';
import { GenericResponseDTO } from '../models/GenericResponseDTO.model';
import { Observable } from 'rxjs';
import { ArchiveProjectDTO } from '../models/ArchiveProjectDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private api: string = environment.api;

  constructor(private http: HttpClient) { }

  public getProjectById(id: number) {
    return this.http.get(`${this.api}/Project/${id}`);
  }

  public getProjectsByUser(activeOnly: boolean) : Observable<GenericResponseDTO<any>> {
    return this.http.get<GenericResponseDTO<any>>(`${this.api}/Project/Bool`, { params: { activeOnly: activeOnly.toString() } });
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

  public updateProjectDetails(updateProject: UpdateProjectDTO) {
    return this.http.patch(`${this.api}/Project`, updateProject)
  }

  public addUserToProject(inviteCode: string) {
    return this.http.post(`${this.api}/Project/AddUserToProject`, { inviteCode })
  }

  public archiveProject(archiveDetails: ArchiveProjectDTO): Observable<GenericResponseDTO<any>> {
    return this.http.post<GenericResponseDTO<any>>(`${this.api}/Project/Archive`, archiveDetails)
  }
}
