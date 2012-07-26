/* =============================================================================
 * SelectMultiDate v0.1
 * Authors: Maarek Joseph
 *
 * Copyright 2012, Maarek Joseph
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * =============================================================================
 */

!function( $ ){

  "use strict"
  
  /* SELECT_MULTI_DATE CLASS DEFINITION
   * ====================== */
  var SelectMultiDate = function (content, options) {
    var self = this;

    self.options = options;
    self.$elements = $(content);
    
    self.selectedDates = [];
    self.selectedDatesHidden = [];

    self.keypress = null;
    
    $(function() {
      
      // On s'abbonne aux events du clavier
      //
      if (self.options.enabledShortcuts == true) {
        $('body').keydown(function(e) {
          self.keypress = e.ctrlKey | e.keyCode == 91 ? 'CTRL' 
          : e.altKey ? 'ALT' 
          : e.shiftKey ? 'SHIFT' : e.keyCode;
        });
      
        $('body').keyup(function(e) {
          self.keypress = null;
        });
      }
      
      // Création du textext 
      //
      self.$textext_html = $('<textarea rows="1" class="select-multi-date"></textarea>');
      self.$elements.append(self.$textext_html);
      self.$textext_html.textext({
        plugins: 'tags arrow'
      });
      self.$textext = self.$textext_html.textext()[0];
      self.$textext.bind('isTagAllowed', function(e, data) {
        var tag = data.tag;
        var motif = tag.split('/');
        if (motif.length != 3 || tag.length != 10) {
          data.result = false;
          return
        }

        var date = $.datepicker.parseDate(self.options.dateFormat, tag);

        if (date_is_forbidden.call(self, date) == true) {
          data.result = false;
          return;
        }
        
        if (can_add.call(self) == false && in_array(date, self.selectedDates) == false) {
          data.result = false;
          return;
        }
        
      });
      self.$textext.arrow().onArrowClick = function(e) {
        self.$datepicker.toggle();
      };
      
      // Création du datepicker
      //
      var options_datepicker = $.datepicker.regional[self.options.culture];
      options_datepicker.dateFormat = self.options.dateFormat;
      options_datepicker.showButtonPanel = false;    
      options_datepicker.beforeShowDay = function(date) {
        if (date_is_forbidden.call(self, date) == true) {
          return [false];
        }

        if (in_array(date, self.selectedDates) != false) {
          return [true, 'ui-state-active'];
        } else {
          return [true, 'ui-state-default'];
        }
      };
      
      
      // Selection d'une date
      //
      options_datepicker.onSelect = function(dateText, inst) {
        var date = self.$datepicker.datepicker('getDate');

        if (in_array(date, self.selectedDates) == false) {
          // Click
          if (self.keypress == 'ALT') {
            var dates = week_of_date(date);
            self.addDates(dates, true);
          } else if (self.keypress == 'SHIFT') {
            var dates = month_of_date(date);
            self.addDates(dates, true);
          } else if (self.keypress == 'CTRL') {
            var dates = same_day_of_date_in_month(date);
            self.addDates(dates, true);
          } else {
            self.addDate(date);
          }
          
        } else {
          // Unclick
          if (self.keypress === 'ALT') {
            var dates = week_of_date(date);
            self.removeDates(dates, true);
          } else if (self.keypress == 'SHIFT') {
            var dates = month_of_date(date);
            self.removeDates(dates, true);
          } else if (self.keypress == 'CTRL') {
            var dates = same_day_of_date_in_month(date);
            self.removeDates(dates, true);
          } else {
            self.removeDate(date);
          }
        }
      };
      
      self.$datepicker = $('<div></div>');
      self.$elements.append(self.$datepicker);
      self.$datepicker.datepicker(options_datepicker);
      self.$datepicker.hide();
      
      // Ajout/Suppression d'item
      //
      self.$textext.bind('setFormData', function(e, data, isEmpty){

        var inFormData = [];
        $.each(data, function(key, value) {
          var date = $.datepicker.parseDate(self.options.dateFormat, value);
          inFormData.push(date);
        });

        var toAdd = $.map(inFormData, function(val, index) {
          if (in_array(val, self.selectedDates) == false) {
            return val;
          } else {
            return null;
          }
        });
        
        var toRemove = $.map(self.selectedDates, function(val, index) {
          if (in_array(val, inFormData) == false) {
            return val;
          } else {
            return null;
          }
        });
        
        self.addDates(toAdd, false);
        self.removeDates(toRemove, false);
      });
    });
  };
  
  
  SelectMultiDate.prototype = {
    constructor: SelectMultiDate,
    
    /**
     * Retourne les dates sélectionnées
     * 
     * @return array 
     */
    getDates: function() {
      return this.selectedDates;
    },
    
    /**
     * Ajoute plusieurs dates
     * 
     * @param dates array Tableau de dates à ajouter
     *  Les éléments du tableau peuvent être de type "date" ou "string" 
     *  de la forme yyyy-mm-dd
     *  
     * @param withSyncTag Vrai si on doit forcer l'ajout des tags.
     */
    addDates: function(dates, withSyncTag) {
      var self = this;
      withSyncTag = typeof withSyncTag == 'undefined' ? true : withSyncTag;
      $.each(dates, function(index, date) {
        self.addDate(date, withSyncTag);
      });
      if (withSyncTag == false) {
        self.refresh();
      }
    },
    
    /**
     * Supprimes plusieurs dates
     * 
     * @param dates array Tableau de dates à supprimer
     *  Les éléments du tableau peuvent être de type "date" ou "string" 
     *  de la forme yyyy-mm-dd
     * 
     * @param withSyncTag Vrai si on doit forcer la suppressions des tags.
     */
    removeDates: function(dates, withSyncTag) {
      var self = this;
      withSyncTag = typeof withSyncTag == 'undefined' ? false : withSyncTag;
      $.each(dates, function(index, date) {
        self.removeDate(date, withSyncTag);
      });
      if (withSyncTag == false) {
        self.refresh();
      }
    },
    
    
    /**
     * Supprime une date
     *
     * @param date date/string La date à supprimer
     *  La date peut etre de type "date" ou "string" 
     *  de la forme yyyy-mm-dd
     *  
     * @param withRefresh Vrai si on doit refresh le calendrier et 
     *  forcer la suppression du tag
     */
    removeDate: function(date, withRefresh) {
      var self = this;
      withRefresh = typeof withRefresh == 'undefined' ? true : withRefresh;
      

      $(function() {
        if (typeof(date) == 'string') {
          date = $.datepicker.parseDate('yy-mm-dd', date);
        }
        if (in_array(date, self.selectedDates) != false) {
          var dateText = $.datepicker.formatDate(self.options.dateFormat, date);
          self.selectedDates = remove_in_array(date, self.selectedDates);
        
          if (withRefresh == true) {
            self.$textext.tags().removeTag([dateText]);
            self.refresh();
          }
        
          self.$elements.trigger('removedDate', date);
        }
      });
    },
    
    /**
     * Ajoute une date
     *
     * @param date date/string La date à ajouter
     *  La date peut etre de type "date" ou "string" 
     *  de la forme yyyy-mm-dd
     *  
     * @param withRefresh Vrai si on doit refresh le calendrier et 
     *  forcer l'ajout du tag
     */
    addDate: function(date, withRefresh) {
      var self = this;
      if (can_add.call(self)) {
        withRefresh = typeof withRefresh == 'undefined' ? true : withRefresh;

        $(function() {
          if (typeof(date) == 'string') {
            date = $.datepicker.parseDate('yy-mm-dd', date);
          }
          
          if (date_is_forbidden.call(self, date) == true) {
            return;
          }
          
          if (in_array(date, self.selectedDates) == false) {
            var dateText = $.datepicker.formatDate(self.options.dateFormat, date);
            self.selectedDates.push(date);
        
            if (withRefresh == true) {
              self.$textext.tags().addTags([dateText]);
              self.refresh();
            }
        
            self.$elements.trigger('addedDate', date);
          }
        });
      }
    },
    
    /**
     * Met à jour le calendrier
     */
    refresh: function() {
      var self = this;
      $(function() {
        self.$datepicker.datepicker('refresh');
      });
    },
    
    /**
     * Vide la sélection
     */
    clear: function() {
      this.selectedDates = [];
      this.refresh();
      this.$elements.trigger('cleared');
    }

  };
  
  
  /* MULTI_DATE PRIVATE METHODS and UTILS
   * ==================================== */
  
  function can_add() {
    var self = this;
    return self.selectedDates.length < self.options.maxDate || self.options.maxDate == 0;
  }
  
  function is_same_date(date1, date2) {
    return date1.getDate() == date2.getDate()
    && date1.getFullYear() == date2.getFullYear()
    && date1.getMonth() == date2.getMonth();
  }
  
  function in_array(needle, haystack) {
    if (typeof(needle) == 'string') {
      needle = $.datepicker.parseDate('yy-mm-dd', needle);
    }
    
    for (var i = 0; i < haystack.length; i++) {
      var value = haystack[i];
      if (typeof(value) == 'string') {
        value= $.datepicker.parseDate('yy-mm-dd', value);
      }
      if (is_same_date(needle, value)) {
        return value;
      }   
    }
    return false;
  }
  
  function remove_in_array(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
      var value = haystack[i];
      if (is_same_date(needle, value)) {
        break;
      }   
    }
    haystack[i] = haystack[haystack.length - 1];
    haystack = haystack.slice(0, -1);
    
    return haystack;
  }
  
  function objet_date_to_international(date) {
    var twodigit = function(i) {
      return (i < 10) ? '0' + i : i;
    };

    return (date.getFullYear() + '-' + twodigit(date.getMonth() + 1) + '-' + twodigit(date.getDate())) + '';
  }
  
  function week_of_date(date) {
    var dates = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(date);
      d.setDate(d.getDate() + 7 - i - d.getDay());
      dates.push(objet_date_to_international(d));
    }
    return dates;
  };
  
  function month_of_date(date) {
    var dates = [];
    
    var end_month = new Date(date);
    end_month.setMonth(end_month.getMonth() + 1);
    end_month.setDate(0);
    
    var i = 1;
    while(true) {
      var d = new Date(date);
      d.setDate(i);
      if (d.getMonth() != end_month.getMonth()) {
        break;
      }
      dates.push(objet_date_to_international(d));
      i++;
    }
    return dates;
  };
  
  function same_day_of_date_in_month(date) {
    var dates = month_of_date(date);
    var day = (new Date(date)).getDay();
    dates = $.map(dates, function(val) {
      if ((new Date(val)).getDay() == day) {
        return val;
      } else {
        return null;
      }
    });
    
    return dates;
  }
  
  function date_is_forbidden(date) {
    var self = this;

    for (var i = 0; i < self.options.disabledDayOfWeek.length; i++) {
      var val = self.options.disabledDayOfWeek[i];
      if (val == date.getDay()) {
        return true;
      }
    }

    if (in_array(date, self.options.disabledDates) != false) {
      return true;
    }

    return false;
  }
  
  /* MULTI_DATE PLUGIN DEFINITION
   * ============================= */
 
  $.fn.selectMultiDate = function(option, param1) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('selectMultiDate');
      if (!data) {
        var options = $.extend({}, $.fn.selectMultiDate.defaults, typeof option == 'object' && option);
        data = new SelectMultiDate(this, options);
        $this.data('selectMultiDate', data);
      }
      if (typeof option == 'string') {
        data[option](param1);
      }
    });
  }
  
  $.fn.selectMultiDate.defaults = {
    culture:          'en',
    // Langue du calendrier
    
    dateFormat:       'dd/mm/yy',
    // Format d'affichage des dates sélectionnées
    
    maxDate:          0,
    // Nombre de date maximums séléctionnables, 0 
    //   veut dire sans limite
    
    enabledShortcuts: true,
    // Active les raccourcies de selections
  
    disabledDayOfWeek: [],
    // Désactive certains jour de la semaine
  
    disabledDates: []
  // Désactive certaines date
  };
  
  $.fn.selectMultiDate.Constructor = SelectMultiDate;

}( window.jQuery );