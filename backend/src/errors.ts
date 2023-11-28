export class StoreFileCommonError extends Error {
  constructor(args: any) {
    super(args)
    this.name = "StoreFileCommonError"
  }
}

export class ArgumentNotFoundError extends Error {
  constructor(args: any) {
    super(args)
  }
}
