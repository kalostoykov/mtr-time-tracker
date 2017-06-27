///<reference path="../_all.ts"/>

'use strict';
import {PageService} from "../services/page";
import {Module} from "../init";
import {ProjectsService} from "../services/projects";

export class HomeController {

    public c = this;
    public getActiveProjects:any;
    public getFinishedProjects:any;

    constructor(private PageService:PageService,
                private ProjectsService:ProjectsService) {
        PageService.resetData();
        PageService.setHtmlTitle("Home");
        PageService.setSlug("home");
        this.loadActiveProjects();
        this.loadFinishedProjects();
    }

    loadActiveProjects() {
        this.ProjectsService.GetActiveProjects()
            .then((projects:any) => {
                this.c.getActiveProjects = projects;
            });
    }

    loadFinishedProjects() {
        this.ProjectsService.GetFinishedProjects()
            .then((projects:any) => {
                this.c.getFinishedProjects = projects;
            });
    }
}

angular.module(Module).controller("HomeController", [
    "PageService",
    "ProjectsService",
    NewHomeController]);
export function NewHomeController(PageService:PageService, ProjectsService:ProjectsService) {
    return new HomeController(PageService, ProjectsService);
}
