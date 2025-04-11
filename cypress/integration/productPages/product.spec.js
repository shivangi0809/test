describe("🧪 Product Page Automation - PetLab Co.", () => {
  let productData;
  const urls = Cypress.env("testUrls");

  before(() => {
    cy.fixture("productData").then((data) => {
      productData = data.products;
    });
  });

  urls.forEach((url) => {
    context(`🔗 Testing product page: ${url}`, () => {
      let matchedProduct;

      before(() => {
        matchedProduct = Object.values(productData).find((p) =>
          url.includes(p.urlPattern)
        );
        if (!matchedProduct)
          throw new Error(`No product config matched for URL: ${url}`);
      });

      beforeEach(() => {
        cy.visit(url);
      });

      it("Page should load successfully (HTTP 200)", () => {
        cy.request(url).its("status").should("eq", 200);
      });

      it("Prices should be displayed in correct currency format", () => {
        cy.validateCurrencyFormat(
          matchedProduct.priceSelector,
          matchedProduct.currencyRegex
        );
      });

      it("It should allow size/package selection and display price", () => {
        // Get the locators from the matched product configuration
        const selectors = {
          subscribeAndSave: matchedProduct.subscribeAndSave,
          oneTimePurchase: matchedProduct.oneTimePurchase,
          buyStockOptions: [
            matchedProduct.buy_5_stock,
            matchedProduct.buy_4_stock,
            matchedProduct.buy_3_stock,
          ],
          dogSizes: [
            matchedProduct.dog_size_small,
            matchedProduct.dog_size_medium,
            matchedProduct.dog_size_large,
          ],
          tubChewsSizes: [
            matchedProduct.tub_chews_small,
            matchedProduct.tub_chews_medium,
            matchedProduct.tub_chews_large,
          ],
        };

        // Helper function to check price
        const checkPrice = () => {
          cy.get(matchedProduct.priceSelector).should("not.be.empty");
          cy.get(matchedProduct.priceSelector)
            .invoke("text")
            .should("match", new RegExp(matchedProduct.currencyRegex));
        };

        // Function to process selectors and check prices
        const processSelectors = (selectorsArray) => {
          selectorsArray.forEach((selector) => {
            if (selector) {
              cy.get(selector).click();
              checkPrice();
            }
          });
        };

        // Check the URL pattern and execute different logic for different patterns
        switch (matchedProduct.urlPattern) {
          case "/probiotic-chews/stock_upbxgy":
            if (selectors.subscribeAndSave && selectors.oneTimePurchase) {
              // Select "Subscribe & Save" and check the price
              cy.get(selectors.subscribeAndSave).click();
              checkPrice();

              // Select "One-Time Purchase" and check the price
              cy.get(selectors.oneTimePurchase).click();
              checkPrice();
            } else {
              cy.log(
                'Missing selectors for "Subscribe & Save" or "One-Time Purchase"'
              );
            }
            break;

          case "stock_upbxgy":
            if (selectors.buyStockOptions.every((selector) => selector)) {
              processSelectors(selectors.buyStockOptions);
            } else {
              cy.log('Missing selectors for "Buy 5", "Buy 4", or "Buy 3"');
            }
            break;

          case "probiotic-allergy-immune":
            if (selectors.tubChewsSizes.every((selector) => selector)) {
              cy.wait(1000);
              processSelectors(selectors.tubChewsSizes);
            } else {
              cy.log("Missing selectors for any size");
            }
            break;

          default:
            cy.log("Unrecognized URL pattern");
            break;
        }
      });

      it("It should validate pricing, discount, shipping, and order total", () => {
        const addToCartSelector = matchedProduct.addToCart;
        const cookie = matchedProduct.cookie;

        if (addToCartSelector) {
          cy.wait(1000);
          cy.get(addToCartSelector)
            .scrollIntoView()
            .should("be.visible")
            .click();
        }

        if (cookie) {
          cy.get(cookie).click();
        }

        cy.fixture("pricingData").then((pricingData) => {
          const urlPattern = matchedProduct.urlPattern;

          if (urlPattern === "probiotic-chews") {
            // Free Shipping
            cy.origin(
              "https://checkouts.petlabco.co.uk",
              { args: { pricing: pricingData.freeShipping } },
              ({ pricing }) => {
                const validateOrderSummary = () => {
                  cy.get('[data-testid="ORDER_SUMMARY"]').should("be.visible");
                  cy.get(
                    '[data-testid="ORDER_SUMMARY__ITEM__FULL_PRICE"]'
                  ).should("contain.text", pricing.fullPrice);
                  cy.get(
                    '[data-testid="ORDER_SUMMARY__ITEM__DISCOUNTED_PRICE"]'
                  ).should("contain.text", pricing.discountedPrice);
                  cy.get('[data-testid="ORDER_SUMMARY__SUBTOTAL"]').should(
                    "contain.text",
                    pricing.subtotal
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__SHIPPING"]').should(
                    "contain.text",
                    pricing.shippingCost
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__SAVINGS"]').should(
                    "contain.text",
                    pricing.savings
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__TOTAL"]').should(
                    "contain.text",
                    pricing.orderTotal
                  );
                };

                validateOrderSummary();
              }
            );

            // Paid Shipping
            cy.origin(
              "https://checkouts.petlabco.co.uk",
              { args: { pricing: pricingData.paidShipping } },
              ({ pricing }) => {
                const validateOrderSummary = () => {
                  cy.get('[data-testid="DELIVERY_ADDRESS__EXPEDITED_DELIVERY"]')
                    .scrollIntoView()
                    .should("be.visible")
                    .click();
                  cy.scrollTo("top");
                  cy.wait(15000);

                  cy.get('[data-testid="ORDER_SUMMARY"]').should("be.visible");
                  cy.get(
                    '[data-testid="ORDER_SUMMARY__ITEM__FULL_PRICE"]'
                  ).should("contain.text", pricing.fullPrice);
                  cy.get(
                    '[data-testid="ORDER_SUMMARY__ITEM__DISCOUNTED_PRICE"]'
                  ).should("contain.text", pricing.discountedPrice);
                  cy.get('[data-testid="ORDER_SUMMARY__SUBTOTAL"]').should(
                    "contain.text",
                    pricing.subtotal
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__SHIPPING"]').should(
                    "contain.text",
                    pricing.shippingCost
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__SAVINGS"]').should(
                    "contain.text",
                    pricing.savings
                  );
                  cy.get('[data-testid="ORDER_SUMMARY__TOTAL"]').should(
                    "contain.text",
                    pricing.orderTotal
                  );
                };

                validateOrderSummary();
              }
            );
          }

          // Handles both multi-line item URLs
          else if (
            urlPattern === "stock_upbxgy" ||
            urlPattern === "probiotic-allergy-immune"
          ) {
            const checkoutUrl = "https://checkouts.thepetlabco.com";
            const pricing =
              urlPattern === "stock_upbxgy"
                ? pricingData.stockUp
                : pricingData.allergyImmune;

            cy.origin(checkoutUrl, { args: { pricing } }, ({ pricing }) => {
              const validateMultiItemSummary = () => {
                cy.get('[data-testid="ORDER_SUMMARY"]').should("be.visible");

                pricing.items.forEach((item, index) => {
                  cy.get('[data-testid="ORDER_SUMMARY__ITEM__FULL_PRICE"]')
                    .eq(index)
                    .should("contain.text", item.fullPrice);

                  const discounted = cy
                    .get(
                      '[data-testid="ORDER_SUMMARY__ITEM__DISCOUNTED_PRICE"]'
                    )
                    .eq(index);
                  if (item.discountedPrice === "FREE") {
                    discounted.should("contain.text", "FREE");
                  } else {
                    discounted.should("contain.text", item.discountedPrice);
                  }
                });

                cy.get('[data-testid="ORDER_SUMMARY__SUBTOTAL"]').should(
                  "contain.text",
                  pricing.subtotal
                );
                cy.get('[data-testid="ORDER_SUMMARY__SHIPPING"]').should(
                  "contain.text",
                  pricing.shippingCost
                );
                cy.get('[data-testid="ORDER_SUMMARY__TAXES"]').should(
                  "contain.text",
                  pricing.taxes
                );
                cy.get('[data-testid="ORDER_SUMMARY__SAVINGS"]').should(
                  "contain.text",
                  pricing.savings
                );
                cy.get('[data-testid="ORDER_SUMMARY__TOTAL"]').should(
                  "contain.text",
                  pricing.orderTotal
                );
              };

              validateMultiItemSummary();
            });
          } else {
            cy.log("Unrecognized urlPattern: " + urlPattern);
          }
        });
      });

      it("It should navigate to the correct pages", () => {
        cy.get('[id="funnel-footer"] a').each(($link) => {
          const href = $link.prop("href");
          const linkText = $link.text().trim();

          if (href && href !== "#") {
            // Step 3b: Send a HEAD request to verify the link is accessible
            cy.request({
              url: href,
              method: "HEAD",
            }).then((response) => {
              expect(response.status).to.be.within(200, 299);
            });
          } else {
            cy.log(`Invalid href for link with text: ${linkText}`);
          }
        });
      });

    });
  });

  after(() => {
    cy.end(); 
    })

});
