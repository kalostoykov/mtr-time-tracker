///<reference path="../_all.ts"/>
import {Module} from "../init";
import {IScope, IEnvConfig} from "../interface";

export interface IPageService {
    resetData():void;
    setHtmlTitle(text:string):string
    setSlug(text:string):string
}

export class PageService implements IPageService {
    public website_title:string;
    public html_title:string;
    public slug:string;


    constructor(private config:IEnvConfig,
                private $scope:IScope) {
    }

    resetData() {
        this.$scope.page.website_title = this.config.appTitle;
        this.$scope.page.html_title = this.config.appTitle;
        this.$scope.page.slug = '';
    }

    setHtmlTitle(html_title:string) {
        this.$scope.page.html_title = html_title + ' | ' + this.$scope.page.html_title;
        return '';
    }

    setSlug(slug:string) {
        this.$scope.page.slug = slug;
        return '';
    }
}

angular.module(Module).factory("PageService", [
    "config", 
    "$rootScope", 
    "ProjectsService", 
    NewPageService]);
export function NewPageService(config:IEnvConfig, $scope:IScope) {
    return new PageService(config, $scope);
}
