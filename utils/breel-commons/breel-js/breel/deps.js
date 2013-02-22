goog.addDependency("../breel/build/Builder.js", ["breel.build.Builder"], ["breel.build.FileContext","breel.build.FileWatcher","breel.build.Pass","goog.events.EventTarget","goog.debug.Logger","node.assert"]);
goog.addDependency("../breel/build/core/Delta.js", ["breel.build.Delta"], ["goog.debug.Logger","goog.object"]);
goog.addDependency("../breel/build/core/FileContext.js", ["breel.build.FileContext"], ["goog.events.EventTarget","node.fs","node.path","node.assert"]);
goog.addDependency("../breel/build/core/FileResolver.js", ["breel.build.FileResolver"], ["breel.build.utils","node.fs","goog.events.EventTarget","goog.debug.Logger"]);
goog.addDependency("../breel/build/core/FileWatcher.js", ["breel.build.FileWatcher"], ["breel.build.Mark","breel.build.FileContext","breel.build.Delta","goog.events.EventTarget","goog.debug.Logger","node.assert","node.events","node.util","node.fs","node.path"]);
goog.addDependency("../breel/build/core/Mark.js", ["breel.build.Mark"], ["goog.events.EventTarget","goog.debug.Logger"]);
goog.addDependency("../breel/build/core/Pass.js", ["breel.build.Pass"], ["goog.events.EventTarget"]);
goog.addDependency("../breel/build/core/Phase.js", ["breel.build.Phase"], ["breel.build.FileResolver","goog.events.EventTarget","goog.debug.Logger"]);
goog.addDependency("../breel/build/index.js", [], ["breel.debug.NodeConsole","goog.debug.Logger"]);
goog.addDependency("../breel/build/phases/ClosureDevelopmentPhase.js", ["breel.build.ClosureDevelopmentPhase"], ["node.assert","breel.build.FileContext","breel.build.Phase","breel.build.utils","goog.debug.Logger"]);
goog.addDependency("../breel/build/utils.js", ["breel.build.utils"], ["node.fs","node.assert"]);
goog.addDependency("../breel/debug/NodeConsole.js", ["breel.debug.NodeConsole"], ["goog.debug.LogManager","goog.debug.Logger.Level","goog.debug.Formatter"]);
goog.addDependency("../breel/manifest/AudioItem.js", ["breel.manifest.AudioItem"], ["breel.tasks.AudioLoaderTask"]);
goog.addDependency("../breel/manifest/Item.js", ["breel.manifest.Item"], []);
goog.addDependency("../breel/manifest/Manifest.js", ["breel.manifest.Manifest"], []);
goog.addDependency("../breel/math/ShuffledIndexMapping.js", ["breel.math.ShuffledIndexMapping"], []);
goog.addDependency("../breel/node/closure.js", [], ["goog.debug.Logger"]);