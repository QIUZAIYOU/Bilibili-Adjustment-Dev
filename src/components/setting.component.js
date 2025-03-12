// SettingsComponent.js
import { storageService } from '@/services/storage.service'
import { elementSelectors } from '@/shared/element-selectors'
import { detectivePageType, insertStyleToDocument, createElementAndInsert, addEventListenerToElement, camelToSnake } from '@/utils/common'
import { styles } from '@/shared/styles'
import { getTemplates } from '@/shared/templates'
export class SettingsComponent {
    constructor () {
        this.userConfigs = {}
    }
    async init (userConfigs) {
        this.userConfigs = userConfigs
        this.pageType = detectivePageType()
        insertStyleToDocument({ 'BilibiliAdjustmentStyle': styles.BilibiliAdjustment })
        this.render(this.pageType)
        this.addEventListeners()
    }
    render (pageType) {
        switch (pageType) {
            case 'video':
                this.renderVideoSetting()
                break
            case 'dynamic':
                this.renderDynamicSetting()
                break
            case 'home':
                this.renderHomeSetting()
                break
            default:
                break
        }
    }
    renderVideoSetting (){
        this.videoSettings = getTemplates.replace('videoSettings', {
            IsVip: this.userConfigs.is_vip,
            AutoLocate: this.userConfigs.auto_locate,
            AutoLocateVideo: this.userConfigs.auto_locate_video,
            AutoLocateBangumi: this.userConfigs.auto_locate_bangumi,
            OffsetTop: this.userConfigs.offset_top,
            PlayerOffsetTop: this.userConfigs.player_offset_top,
            ClickPlayerAutoLocation: this.userConfigs.click_player_auto_location,
            SelectedPlayerModeClose: this.userConfigs.selected_player_mode === 'close',
            SelectedPlayerModeWide: this.userConfigs.selected_player_mode === 'wide',
            SelectedPlayerModeWeb: this.userConfigs.selected_player_mode === 'web',
            WebfullUnlock: this.userConfigs.webfull_unlock,
            AutoSelectVideoHighestQuality: this.userConfigs.auto_select_video_highest_quality,
            ContainQuality4kStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContainQuality4k: this.userConfigs.contain_quality_4k,
            ContainQuality8kStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContainQuality8k: this.userConfigs.contain_quality_8k,
            InsertVideoDescriptionToComment: this.userConfigs.insert_video_description_to_comment,
            AutoSkip: this.userConfigs.auto_skip,
            PauseVideo: this.userConfigs.pause_video,
            ContinuePlayStyle: this.userConfigs.is_vip ? 'flex' : 'none',
            ContinuePlay: this.userConfigs.continue_play,
            AutoSubtitle: this.userConfigs.auto_subtitle,
            AutoReload: this.userConfigs.auto_reload
        })
        this.videoSettingElement = createElementAndInsert(this.videoSettings, document.body, 'append')
    }
    async addEventListeners () {
        const batchSelectors = ['app', 'videoSettingsPopover', 'IsVip', 'AutoLocate', 'AutoLocateVideo', 'AutoLocateBangumi', 'ClickPlayerAutoLocation', 'WebfullUnlock', 'AutoSelectVideoHighestQuality', 'ContainQuality4k', 'ContainQuality8k', 'InsertVideoDescriptionToComment', 'AutoSkip', 'PauseVideo', 'ContinuePlay', 'AutoSubtitle', 'OffsetTop', 'Checkbox4K', 'Checkbox8K']
        const [app, videoSettingsPopover, IsVip, AutoLocate, AutoLocateVideo, AutoLocateBangumi, ClickPlayerAutoLocation, WebfullUnlock, AutoSelectVideoHighestQuality, ContainQuality4k, ContainQuality8k, InsertVideoDescriptionToComment, AutoSkip, PauseVideo, ContinuePlay, AutoSubtitle, OffsetTop, Checkbox4K, Checkbox8K] = await elementSelectors.batch(batchSelectors)
        addEventListenerToElement(videoSettingsPopover, 'toggle', e => {
            if (e.newState === 'open') app.style.pointerEvents = 'none'
            if (e.newState === 'closed') app.style.pointerEvents = 'auto'
        })
        addEventListenerToElement([IsVip, AutoLocate, AutoLocateVideo, AutoLocateBangumi, ClickPlayerAutoLocation, WebfullUnlock, AutoSelectVideoHighestQuality, ContainQuality4k, ContainQuality8k, InsertVideoDescriptionToComment, AutoSkip, PauseVideo, ContinuePlay, AutoSubtitle], 'change', async e => {
            const configKey = camelToSnake(e.target.id)
            await storageService.legacySet(configKey, e.target.checked)
            e.target.attributes.checked.value = await storageService.legacyGet(configKey)
            if (e.target.id === 'IsVip'){
                Checkbox4K.style.display = e.target.checked ? 'flex' : 'none'
                Checkbox8K.style.display = e.target.checked ? 'flex' : 'none'
            }
            if (e.target.id === 'OffsetTop'){
                await storageService.legacySet(configKey, e.target.value)
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
}
