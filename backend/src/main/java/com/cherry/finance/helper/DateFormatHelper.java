package com.cherry.finance.helper;

import java.time.format.DateTimeFormatter;

public class DateFormatHelper {
    public static final DateTimeFormatter  DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    public static final DateTimeFormatter   DATE_FORMATTER= DateTimeFormatter.ofPattern("dd-MM-yyyy");
}
