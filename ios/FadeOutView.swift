import ExpoModulesCore
import SwiftUI
import UIKit

// MARK: - FadeOutView
class FadeOutView: ExpoView {
  // MARK: - Properties
  let onFadeOutComplete = EventDispatcher()
  let onFadeInComplete = EventDispatcher()
  var animationDuration: Double = 1.0
  var fadeOutDelay: Double = 0.0
  var fadeInDelay: Double = 0.0

  private let blurEffect = UIBlurEffect(style: .regular)
  private lazy var blurView: UIVisualEffectView = {
    let view = UIVisualEffectView(effect: nil)
    view.translatesAutoresizingMaskIntoConstraints = false
    return view
  }()

  // MARK: - Initialization
  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setupView()
  }

  private func setupView() {
    clipsToBounds = true

    // Add blur view above all content
    addSubview(blurView)
    blurView.isUserInteractionEnabled = false
    NSLayoutConstraint.activate([
      blurView.topAnchor.constraint(equalTo: topAnchor),
      blurView.leadingAnchor.constraint(equalTo: leadingAnchor),
      blurView.trailingAnchor.constraint(equalTo: trailingAnchor),
      blurView.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])
  }

  // MARK: - Animation
  func performFadeOut() {
    DispatchQueue.main.asyncAfter(deadline: .now() + fadeOutDelay) {
      UIView.animate(withDuration: self.animationDuration) {
        self.alpha = 0
        self.blurView.effect = self.blurEffect
      } completion: { _ in
        self.onFadeOutComplete()
      }
    }
  }

  func performFadeIn() {
    DispatchQueue.main.asyncAfter(deadline: .now() + fadeInDelay) {
      UIView.animate(withDuration: self.animationDuration) {
        self.alpha = 1
        self.blurView.effect = nil
      } completion: { _ in
        self.onFadeInComplete()
      }
    }
  }
}
