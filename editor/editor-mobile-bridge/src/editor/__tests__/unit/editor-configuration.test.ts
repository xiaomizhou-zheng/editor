import MobileEditorConfiguration, {
  EditorAppearance,
} from '../../editor-configuration';

const locale = navigator.language;
describe('Editor Configuration', () => {
  it('should have default values for its properties', () => {
    const editorConfig = new MobileEditorConfiguration();

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual(locale);
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
    expect(editorConfig.isScrollGutterPersisted()).toEqual(false);
    expect(editorConfig.isCustomPanelEnabled()).toEqual(false);
    expect(editorConfig.isCustomPanelEditable()).toEqual(false);
    expect(editorConfig.isTableCellOptionsInFloatingToolbar()).toEqual(false);
  });

  it('should persist scroll gutter for compact editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "compact"}',
    );

    expect(editorConfig.isScrollGutterPersisted()).toEqual(true);
  });

  it('should not persist scroll gutter for full editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "full"}',
    );

    expect(editorConfig.isScrollGutterPersisted()).toBe(false);
  });

  it('should disable the indentations for compact editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "compact"}',
    );

    expect(editorConfig.isIndentationAllowed()).toEqual(false);
  });

  it('should enable the indentations for full editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "full"}',
    );

    expect(editorConfig.isIndentationAllowed()).toEqual(true);
  });

  it('should disable tasks and decision for compact editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "compact"}',
    );

    expect(editorConfig.isTasksAndDecisionsAllowed()).toEqual(false);
  });

  it('should enable tasks and decisions for full editor', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"editorAppearance": "full"}',
    );

    expect(editorConfig.isTasksAndDecisionsAllowed()).toEqual(true);
  });

  it('should set the mode value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "mode": "dark" }');

    expect(editorConfig.getMode()).toEqual('dark');
    expect(editorConfig.getLocale()).toEqual(locale);
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should set the locale value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration('{ "locale": "es" }');

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual('es');
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should set the isQuickInsertEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{ "enableQuickInsert": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual(locale);
    expect(editorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should set the isSelectionObserverEnabled value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"selectionObserverEnabled": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual(locale);
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(true);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should set the allowCollabProvider value and retain the rest with default values', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowCollabProvider": true}',
    );

    expect(editorConfig.getMode()).toEqual('light');
    expect(editorConfig.getLocale()).toEqual(locale);
    expect(editorConfig.isQuickInsertEnabled()).toEqual(false);
    expect(editorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(editorConfig.isCollabProviderEnabled()).toEqual(true);
  });

  it('should set the allowCustomPanel value', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowCustomPanel": true}',
    );

    expect(editorConfig.isCustomPanelEnabled()).toEqual(true);
  });

  it('should set the allowCustomPanelEdit value', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"allowCustomPanelEdit": true}',
    );

    expect(editorConfig.isCustomPanelEditable()).toEqual(true);
  });

  it('should set the tableCellOptionsInFloatingToolbar value', () => {
    const editorConfig = new MobileEditorConfiguration(
      '{"tableCellOptionsInFloatingToolbar": true}',
    );

    expect(editorConfig.isTableCellOptionsInFloatingToolbar()).toEqual(true);
  });

  it('should clone and update the current configuration with the new configuration', () => {
    const newConfig = '{"locale":"zh", "mode": "light"}';
    const originalEditorConfig = new MobileEditorConfiguration(
      '{"mode": "dark", "enableQuickInsert": true}',
    );
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.getMode()).toEqual('light');
    expect(newEditorConfig.getLocale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should clone and update the default configuration with the new configuration', () => {
    const newConfig =
      '{"locale":"zh", "mode": "dark", "enableQuickInsert": true}';
    const originalEditorConfig = new MobileEditorConfiguration();
    const newEditorConfig = originalEditorConfig.cloneAndUpdateConfig(
      newConfig,
    );

    expect(newEditorConfig.getMode()).toEqual('dark');
    expect(newEditorConfig.getLocale()).toEqual('zh');
    expect(newEditorConfig.isQuickInsertEnabled()).toEqual(true);
    expect(newEditorConfig.isSelectionObserverEnabled()).toEqual(false);
    expect(newEditorConfig.isCollabProviderEnabled()).toEqual(false);
  });

  it('should persist scroll gutter for compact editor', () => {
    const originalEditorConfig = new MobileEditorConfiguration();

    jest
      .spyOn(originalEditorConfig, 'getEditorAppearance')
      .mockReturnValueOnce(EditorAppearance.COMPACT);

    expect(originalEditorConfig.isScrollGutterPersisted()).toBe(true);
  });

  it('should not persist scroll gutter for full editor', () => {
    const originalEditorConfig = new MobileEditorConfiguration();

    jest
      .spyOn(originalEditorConfig, 'getEditorAppearance')
      .mockReturnValueOnce(EditorAppearance.FULL);

    expect(originalEditorConfig.isScrollGutterPersisted()).toBe(false);
  });
});
