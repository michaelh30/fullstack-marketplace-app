package com.example.pp_marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponse<T> {
    private List<T> content;
    private int page;          // 0-based page index
    private int size;          // items per page
    private long totalElements; // total matching records
    private int totalPages;
    private boolean first;
    private boolean last;
}
