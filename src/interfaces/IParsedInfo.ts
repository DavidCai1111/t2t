'use strict'
export interface IProjectInfo {
  name: string
}

export interface ISubtasksInfo {
  content: string
}

export interface ITasksInfo {
  content: string
  subtasks: Array<ISubtasksInfo>
  comment: string
  note: string
}

export interface IEventsInfo {
  title: string
  startDate: Date
  endDate?: Date | any
  comment: string
}

export interface IPostsInfo {
  title: string
  content: string
}

export interface IWorksInfo {
  fileName: string
  path: string
}

export interface ICollectionsInfo {
  title: string
  works: Array<IWorksInfo>
}

export interface IParsedProjectInfo {
  projectInfo: IProjectInfo
  tasksInfo: Array<ITasksInfo>
  eventsInfo: Array<IEventsInfo>
  postsInfo: Array<IPostsInfo>
  collectionsInfo: Array<ICollectionsInfo>
}
