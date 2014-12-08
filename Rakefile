

desc 'test'
task :test do
  sh 'pushd TestProject && rm -rf platforms plugins'
  sh "pushd TestProject && cordova platform add ios"
  sh "pushd TestProject && cordova plugin add ../TestFlightBetaEntitlement"
  #sh "pushd TestProject && cat ./platforms/ios/HelloCordova/HelloCordova-Info.plist | approvals EntitlementsPlist"
end
