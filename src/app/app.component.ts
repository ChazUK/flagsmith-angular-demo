import { Component } from "@angular/core";
import flagsmith from "flagsmith";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  logs = [];
  loading = true;
  environmentID = "QjgYur4LQTwe5HpvbvhpzK";
  identity = null;
  buttonClicks = null;
  trait = null;
  hero = flagsmith.hasFeature("hero");
  heroValue = flagsmith.getValue("hero");

  constructor() {
    const { environmentID, handleFlags, handleFlagsError } = this;

    flagsmith.init({
      environmentID,
      onChange: handleFlags,
      onError: handleFlagsError,
      defaultFlags: {
        default_feature: { enabled: true },
        font_size: { enabled: true, value: 12 },
      },
    });
  }

  handleFlags = (oldFlags, params) => {
    this.loading = false;
    this.logs = [
      {
        timestamp: new Date().toTimeString(),
        params: JSON.stringify(params),
        data: JSON.stringify(flagsmith.getAllFlags()),
      },
    ].concat(this.logs);
    console.log("Flags updated", flagsmith.getAllFlags());
    this.identity = flagsmith.identity;
    this.buttonClicks = flagsmith.getTrait("button_clicks");
    this.trait = flagsmith.getTrait("example_trait") + "";
  };

  handleFlagsError = (data) => {
    console.error("Error updating flags", data);
  };

  logout = () => {
    flagsmith.logout();
  };

  login = () => {
    flagsmith.identify("flagsmith_sample_user");
  };

  submitTrait = () => {
    flagsmith.setTrait(
      "example_trait",
      "Some value " + Math.floor(Math.random() * 10) + ""
    );
  };
}
