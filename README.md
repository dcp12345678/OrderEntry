# A react native test project #
* This app is still under construction.


## ToDo ##
1. Set up PropTypes for PickerButton
2. Change to use new react-native navigation (see https://facebook.github.io/react-native/docs/navigation.html) - done
3. Set up linter
4. Try to git rid of co library and use async/await - done

## Notes ##
* The packager crashes often on Windows, to get around it do the following steps:
  1. Use the workaround listed [here](https://github.com/facebook/react-native/issues/9136#issuecomment-248565578)
  2. Anytime you stop the package manager, before running `react-native run-android` again you need to remove `android\build` and `android\build\app` directories