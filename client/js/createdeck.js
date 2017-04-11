var $main = function() {
  var coverImg = $('#selectCoverPhoto');
  var uploadArea = $('#uploadArea');

  function addImageUploadForm() {
    console.log("updating...");
    var startDiv = '<div class="form-group">';
    var label = '<label for="exampleInputFile">File input</label>';
    var inputType = '<input type="file" id="imageCoverUpload" name="imageCoverUpload">';
    var pTag = '<p class="help-block">200 x 200 pixel images only!</p>';
    var endDiv = '</div>';
    var inputForm = startDiv + label + inputType + pTag + endDiv;
    uploadArea.append(inputForm).hide().fadeIn(1000);
  };

  function removeImageUploadForm() {
    uploadArea.fadeOut(1000);
    uoloadArea.remove();
  }

  coverImg.on('change', function() {
    console.log($(this).val());

    if($(this).val() === 'Upload Your Own Cover ... Coming Soon :)') {
      addImageUploadForm();
    } else {
      removeImageUploadForm();
    }
  });
};
$(document).ready($main);
