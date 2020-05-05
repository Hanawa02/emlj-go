export class ListFormColumn {
  constructor(
    public propertyName: string,
    public displayName: string,
    public allowSort: boolean = false,
    public styleClass: string = '',
    public shouldFormat: boolean = false,
    public format: (value: any) => any = null
  ) {}
}
