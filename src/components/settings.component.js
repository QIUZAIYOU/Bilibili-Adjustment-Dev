import { storageService } from '@/services/storage.service'
import { elementSelectors } from '@/shared/element-selectors'
import { detectivePageType, createElementAndInsert, addEventListenerToElement, camelToSnake, initializeCheckbox } from '@/utils/common'
import { getTemplates } from '@/shared/templates'
export class SettingsComponent {
    constructor () {
        this.userConfigs = {}
    }
    async init (userConfigs) {
        this.userConfigs = userConfigs
        this.pageType = detectivePageType()
        this.render(this.pageType)
    }
    render (pageType) {
        switch (pageType) {
            case 'video':
                this.renderVideoSettings()
                this.initVideoSettingsEventListeners()
                break
            case 'dynamic':
                this.renderDynamicSettings()
                this.initDynamicSettingsEventListeners()
                break
            default:
                break
        }
    }
    renderVideoSettings (){
        const videoSettings = getTemplates.replace('videoSettings', {
            IsVip: this.userConfigs.is_vip,
            AutoLocate: this.userConfigs.auto_locate,
            AutoLocateVideo: this.userConfigs.auto_locate_video,
            AutoLocateBangumi: this.userConfigs.auto_locate_bangumi,
            OffsetTop: this.userConfigs.offset_top,
            PlayerOffsetTop: this.userConfigs.player_offset_top,
            ClickPlayerAutoLocate: this.userConfigs.click_player_auto_location,
            SelectedPlayerModeClose: this.userConfigs.selected_player_mode === 'close',
            SelectedPlayerModeWide: this.userConfigs.selected_player_mode === 'wide',
            SelectedPlayerModeWeb: this.userConfigs.selected_player_mode === 'web',
            WebfullUnlock: this.userConfigs.webfull_unlock,
            AutoSelectVideoHighestQuality: this.userConfigs.auto_select_video_highest_quality,
            ContainQuality4kStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContainQuality4k: this.userConfigs.contain_quality4k,
            ContainQuality8kStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContainQuality8k: this.userConfigs.contain_quality8k,
            InsertVideoDescriptionToComment: this.userConfigs.insert_video_description_to_comment,
            AutoSkip: this.userConfigs.auto_skip,
            PauseVideo: this.userConfigs.pause_video,
            ContinuePlayStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContinuePlay: this.userConfigs.continue_play,
            AutoSubtitle: this.userConfigs.auto_subtitle,
            AutoReload: this.userConfigs.auto_reload
        })
        createElementAndInsert(videoSettings, document.body)
    }
    async initVideoSettingsEventListeners () {
        const batchSelectors = ['app', 'VideoSettingsPopover', 'IsVip', 'AutoLocate', 'AutoLocateVideo', 'AutoLocateBangumi', 'ClickPlayerAutoLocate', 'WebfullUnlock', 'AutoSelectVideoHighestQuality', 'ContainQuality4k', 'ContainQuality8k', 'InsertVideoDescriptionToComment', 'AutoSkip', 'PauseVideo', 'ContinuePlay', 'AutoSubtitle', 'OffsetTop', 'Checkbox4K', 'Checkbox8K', 'AutoReload']
        const [app, VideoSettingsPopover, IsVip, AutoLocate, AutoLocateVideo, AutoLocateBangumi, ClickPlayerAutoLocate, WebfullUnlock, AutoSelectVideoHighestQuality, ContainQuality4k, ContainQuality8k, InsertVideoDescriptionToComment, AutoSkip, PauseVideo, ContinuePlay, AutoSubtitle, OffsetTop, Checkbox4K, Checkbox8K, AutoReload] = await elementSelectors.batch(batchSelectors)
        addEventListenerToElement(VideoSettingsPopover, 'toggle', e => {
            if (e.newState === 'open') app.style.pointerEvents = 'none'
            if (e.newState === 'closed') app.style.pointerEvents = 'auto'
        })
        const checkboxElements = [IsVip, AutoLocate, AutoLocateVideo, AutoLocateBangumi, ClickPlayerAutoLocate, WebfullUnlock, AutoSelectVideoHighestQuality, ContainQuality4k, ContainQuality8k, InsertVideoDescriptionToComment, AutoSkip, PauseVideo, ContinuePlay, AutoSubtitle, AutoReload]
        initializeCheckbox(checkboxElements, this.userConfigs)
        addEventListenerToElement(checkboxElements, 'change', async e => {
            const configKey = camelToSnake(e.target.id)
            await storageService.legacySet(configKey, Boolean(e.target.checked))
            e.target.setAttribute('checked', await storageService.legacyGet(configKey))
            if (e.target.id === 'IsVip'){
                Checkbox4K.style.display = e.target.checked ? 'flex' : 'none'
                Checkbox8K.style.display = e.target.checked ? 'flex' : 'none'
            }
            if (e.target.id === 'OffsetTop'){
                await storageService.legacySet(configKey, e.target.value)
            }
            if (e.target.id === 'AutoSubtitle'){
                const AutoEnableSubtitleSwitchInput = await elementSelectors.AutoEnableSubtitleSwitchInput
                AutoEnableSubtitleSwitchInput.checked = e.target.checked
                AutoEnableSubtitleSwitchInput.setAttribute('checked', e.target.checked.toString())
            }
        })
        addEventListenerToElement(OffsetTop, 'change', async e => {
            await storageService.legacySet('offset_top', e.target.value)
        })
        elementSelectors.each('SelectPlayerModeButtons', btn => {
            addEventListenerToElement(btn, 'click', async e => {
                await storageService.legacySet('selected_player_mode', e.target.value)
            })
        })
    }
    renderDynamicSettings (){
        const dynamicSettings = getTemplates.replace('dynamicSettings', {
            DynamicVideoLink: this.userConfigs.dynamic_video_link
        })
        createElementAndInsert(dynamicSettings, document.body)
    }
    async initDynamicSettingsEventListeners (){
        const batchSelectors = ['app', 'DynamicSettingsPopover']
        const [app, DynamicSettingsPopover] = await elementSelectors.batch(batchSelectors)
        addEventListenerToElement(DynamicSettingsPopover, 'toggle', e => {
            if (e.newState === 'open') app.style.pointerEvents = 'none'
            if (e.newState === 'closed') app.style.pointerEvents = 'auto'
        })
    }
}
