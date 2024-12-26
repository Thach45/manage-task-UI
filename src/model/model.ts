interface Task {
    id?: Number | undefined;
    title?: String | undefined;
    status?: String | undefined;
    timeStart?: Date | undefined;
    timeEnd?: Date | undefined;
    content?: String | undefined;
    deleted?: Boolean | undefined;
    priority?: String | undefined;
    _id?: String | undefined;

  }

export default Task;