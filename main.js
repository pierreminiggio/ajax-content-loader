let addInstancesProto = require('@pierreminiggio/add-instance-proto')

const $ = require('jquery')
const Ajax = require('@pierreminiggio/ajax-as-promise')
const Swal = require('sweetalert2')

let AjaxContentSingleton = (function () {
    let buildInstance = function () {

        this.load = function (jquerySelector = '.ajax-content', callback = function (elt) {}, reload = false) {
            let singleton = this
            // On repère un objet via son id, s'il n'en a pas on lui donne un prefix et un numéro

            $(jquerySelector).each(function () {
                if ($(this).data('loaded') === undefined || reload) {
                    let contentUrl = $(this).data('content')

                    let identifier = singleton.createInstanceIdentifier(this)
                    if (contentUrl !== '' && contentUrl !== undefined) {
                        $(this).data('loaded', '1')

                        if ($(this).data('loadcontentsilently') === undefined) {
                            singleton.setElementAsLoading(this)
                        }

                        Ajax.get(contentUrl, {}, dataType = 'html')
                            .then(data => {
                                $(this).html(data)
                                callback(this)
                            })
                            .catch(error => {

                                // Error
                                console.log(error)
                            })
                    }
                    singleton.loadedInstances[identifier] = this
                }
            })
        }

        this.reload = (id, callback = (elt) => {}) => {
            this.reloadElement(this.get(id), callback)
        }

        this.reloadElement = (jquerySelector = '.ajax-content', callback = (elt) => {}) => {
            $(jquerySelector).data('loaded', undefined)
            this.load(jquerySelector, callback, true)
        }

        this.getLoadingView = () => '<div style="display: flex; justify-content:center;"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>'

        this.setAsLoading = (id) => {
            this.setElementAsLoading(this.get(id))
        }

        this.setElementAsLoading = (elt) => {
            if ($(elt).html() !== this.getLoadingView()) {
                $(elt).html(this.getLoadingView())
            }
        }

        this.displayLoadingSwal = () => {
            return Swal.fire({
                html: this.getLoadingView(),
                showConfirmButton: false
            })
        }
    }

    let instance = null
    return new function () {
        this.getInstance = function () {
            if (instance == null) {
                instance = new buildInstance()
                instance.buildInstance = null
            }
            return instance
        }
    }
})()

let AjaxContent = AjaxContentSingleton.getInstance()
addInstancesProto(AjaxContent)

module.exports = AjaxContent
