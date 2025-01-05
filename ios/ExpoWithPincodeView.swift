import ExpoModulesCore

class VisibilityView: ExpoView {
    let onBecameVisible = EventDispatcher()
    let onBecameHidden = EventDispatcher()

    private(set) var isVisible: Bool = false {
        willSet {
            guard newValue != isVisible else { return }
            if newValue {
                onBecameVisible()
            } else {
                onBecameHidden()
            }
        }
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil && !isVisible {
            isVisible = true
        }
        if window == nil && isVisible {
            isVisible = false
        }
    }

    override func willMove(toSuperview newSuperview: UIView?) {
        if newSuperview != nil && !isVisible {
            isVisible = true
        }
        if newSuperview == nil && isVisible {
            isVisible = false
        }
        super.willMove(toSuperview: newSuperview)
    }
}
