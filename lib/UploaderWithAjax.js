(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('UploaderWithAjax', [], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UploaderWithAjax = factory();
  }
}(this, function() {

  var UploaderWithAjax = function (options) {

    var file        = options.file;
    var $fileInput  = options.$fileInput;
    var submitting  = new $.Deferred();
    var postUrl     = options.postUrl;
    var formData    = new FormData();

    function doUpload() {
      addFileToFormData();

      var posting   = _doPost(formData);
      posting.fail(_handlePostingFail);
      posting.success(_handlePostingSuccess);

      return submitting.promise();
    }

    function addFileToFormData() {
      formData.append('file', file);
    }

    function _handlePostingFail(jqXHR, textStatus) {
      submitting.reject({
        'status'   : jqXHR.status,
        'statusText': jqXHR.statusText,
        'responseText' : JSON.parse(jqXHR.responseText).responseText
      });
    }

    function _handlePostingSuccess(response, textStatus, jqXHR) {
      var result = JSON.parse(response);

      if (result.status.toString().match(/^20\d\b/)) { // 20x status code
        submitting.resolve(result);
      } else {
        submitting.reject(result);
      }
    }

    function _doPost(formData) {
      return $.ajax({
        url         : postUrl,
        type        : 'POST',
        data        : formData,
        contentType : false,
        processData : false
      });
    }

    return {
      doUpload: doUpload
    };
  };

  return UploaderWithAjax;
}));
