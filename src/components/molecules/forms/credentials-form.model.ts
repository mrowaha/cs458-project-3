import { computed } from "mobx";
import { Model, modelAction, prop, model, getSnapshot } from "mobx-keystone";
import { omit } from "lodash";
export interface ICredentialsFormModel {
  email: string;
  setEmail(val: string): void;
  password: string;
  setPassword(val: string): void;
  errors: Record<string, any>;

  toJson: any;
}

const create = (data: { email: string; password: string }) => {
  return new CredentialsFormModel({ ...data });
};

@model("credentials-form")
export class CredentialsFormModel
  extends Model({
    email: prop<string>("").withSetter(),
    password: prop<string>("").withSetter(),
  })
  implements ICredentialsFormModel
{
  static create = create;

  @computed
  get errors() {
    const _errors = {
      email: null,
      password: null,
    };

    if (this.email === "") _errors.email = "Email Cannot be Empty";
    if (this.password === "") _errors.password = "Pasword Cannot be Empty";
    return _errors;
  }

  @computed
  get toJson() {
    return omit(getSnapshot(this), ["errors", "$modelType"]);
  }
}
