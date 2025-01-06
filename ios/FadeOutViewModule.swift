import ExpoModulesCore

public class FadeOutViewModule: Module {
    public func definition() -> ModuleDefinition {
        Name("FadeOutView")

        View(FadeOutView.self) {
            Prop("animationDuration") { (view: FadeOutView, value: Double) in
                view.animationDuration = value / 1000
            }
            Prop("fadeOutDelay") { (view: FadeOutView, value: Double) in
                view.fadeOutDelay = value / 1000
            }
            Prop("fadeInDelay") { (view: FadeOutView, value: Double) in
                view.fadeInDelay = value / 1000
            }
            Prop("isVisible") { (view: FadeOutView, value: Bool) in
                if value {
                    print("performing fade in")
                    view.performFadeIn()
                } else {
                    print("performing fade out")
                    view.performFadeOut()
                }
            }
            Events("onFadeOut", "onFadeIn")
        }
    }
}
