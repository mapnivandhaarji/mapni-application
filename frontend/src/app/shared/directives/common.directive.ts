/*
*All common directives
*Note : On add new directive please add it in directives.module.ts file also
*/
import { Directive, ElementRef, AfterViewInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
declare const $: any;

/*
*For mcustom scroll bar
*/
@Directive({
  selector: '[appScrollBar]'
})
export class ScrollBarDirective implements AfterViewInit {

  //Start for pagination : this is not required only recuired if need pagination
  @Input() isScroll: boolean = false;
  @Input() scrollTrigger: number = 70;
  @Output() callScrollPaginationMethod = new EventEmitter();
  //End for pagination : this is not required only recuired if need pagination

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {

    const self = this;

    //console.log("this.elementRef.nativeElement.id : ",this.elementRef.nativeElement.id);

    //$(".common-scroll").mCustomScrollbar({
    $("#" + this.elementRef.nativeElement.id).mCustomScrollbar({
      axis: "y",
      autoHideScrollbar: false,
      mouseWheelPixels: 20,
      scrollInertia: 50,
      setLeft: -100,
      callbacks: {
        onScroll: function () {
          // console.log("Content scrolled...scroll per : ", this.mcs.topPct+"%");
          // console.log("Content scrolled...self.isScroll : ", self.isScroll);
          if (this.mcs.topPct > self.scrollTrigger && self.isScroll === true) {
            self.callScrollPaginationMethod.next(void 0);
          }
        }
      }
    });
  }
}


// copy paste and cut 
@Directive({
  selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
  constructor() { }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
}


/*
*For prevent to type all except 1 to 9 and backspace,etc
*/
@Directive({ selector: '[appNumbersOnly]' })
export class NumbersOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    console.log(e.keyCode);
    // Allow: backspace, delete, tab, escape, enter and . (110 for . which is removed)
    if ([46, 8, 9, 27, 13, 190, 116].indexOf(e.keyCode) !== -1 ||
      (e.keyCode == 65 && e.ctrlKey === true) ||
      (e.keyCode == 67 && e.ctrlKey === true) ||
      (e.keyCode == 86 && e.ctrlKey === true) ||
      (e.keyCode == 116 && e.ctrlKey === true) ||
      (e.keyCode == 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}

/*
*Initialize datepicker
*/
@Directive({ selector: '[appDatepicker]' })
export class DatepickertDirective implements AfterViewInit {

  @Output() callParentMethod = new EventEmitter();

  constructor(el: ElementRef) { }

  ngAfterViewInit(): void {
    const self = this;
    var options = {
      //dateFormat: 'dd-mm-yy',
      format: 'dd/mm/yyyy',
      changeMonth: true,
      changeYear: true,
      autoclose: true,
      startDate: '-100y', // last hundred years
      endDate: '-12y', // minimum birthdate 12 years
      //yearRange: "-90:-18", // last hundred years
      //yearRange: "-100:+0", // last hundred years
      //this year range is defined for profile if this date picker need other place please manage this profile by id.
      onChangeMonthYear: function (year, month, inst) {
        var curDate = $(this).datepicker("getDate");
        if (curDate === null)
          return;
        if (curDate.getYear() != year || curDate.getMonth() != month - 1) {
          curDate.setYear(year);
          curDate.setMonth(month - 1);
          $(this).datepicker("setDate", curDate);
        }
      },
      // onSelect: function() {
      //   $(this).change();
      // }
    };
    $(".datepicker").datepicker(options).on('changeDate', function (ev) {
      var curDate = $(this).datepicker("getDate");
      //curDate.setHours(0);
      self.callParentMethod.next(curDate);
    });

    // $(".datepicker").datepicker({
    // 	autoclose: true,
    // 	todayHighlight: true
    // }).datepicker('update', new Date());
  }
}

/*
*Infinite scroll bar
*/
@Directive({
  selector: '[appScrollPagination]'
})
export class scrollPaginationDirective implements AfterViewInit {

  @Input() isScroll: boolean = false;
  @Input() scrollTrigger: number = 70;
  @Output() callScrollPaginationMethod = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    let scrollPercent = Math.round(($(window).scrollTop()) / ($(document).height() - $(window).height()) * 100);
    //console.log("here for scroll from scrollPaginationDirective........ : ", this.isScroll, scrollPercent, this.scrollTrigger);
    if (scrollPercent > this.scrollTrigger) {
      if (this.isScroll === true) {
        this.callScrollPaginationMethod.next(void 0);
      }
    }
  }
}

/*
*For confirm dialog box
*/
@Directive({
  selector: '[appConfirm]'
})
export class ConfirmDirective {
  @Input() confirmTitle: string = "Confirm!";
  @Input() confirmContent: string = "Are you sure?";
  @Output('confirm-click') click: any = new EventEmitter();

  @HostListener('click', ['$event']) clicked(e) {
    $.confirm({
      title: this.confirmTitle,
      content: this.confirmContent,
      buttons: {
        yes: () => this.click.emit(),
        no: () => { }
      }
    });
  }

}

/*
*For select2
*/
// @Directive({
//   selector: '[appSelect2]'
// })
// export class Select2Directive implements AfterViewInit {
//   constructor(private el: ElementRef) {}

//   ngAfterViewInit(): void {
//     $('.select2Class').select2();
//   }
// }

/*
*For emoji
*/
// @Directive({
//   selector: '[appEmojiPicker]'
// })
// export class EmojiPickerDirective implements AfterViewInit {
//   // constructor(el: ElementRef) {}

//   ngAfterViewInit(): void {
//     // Initializes and creates emoji set from sprite sheet
//     window.emojiPicker = new EmojiPicker({
//       emojiable_selector: '[data-emojiable=true]',
//       assetsPath: 'assets/images/emoji-custom/img',
//       popupButtonClasses: 'fa fa-smile-o'
//     });
//     // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
//     // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
//     // It can be called as many times as necessary; previously converted input fields will not be converted again
//     window.emojiPicker.discover();
//   }
// }

// @Directive({ selector: '[myHighlight]' })
// export class HighlightDirective {
//     constructor(el: ElementRef) {
//        el.nativeElement.style.backgroundColor = 'yellow';
//     }
// }
