class VersionsController < ApplicationController

  def index
    @versions = Version.all.order('created_at DESC').map do |version|
      { currency: Currency.find(version.item_id).name,
        currency_buy_rate: version.reify.buy_price,
        currency_sell_rate: version.reify.sell_price,
        created_at: version.created_at.strftime('%d.%m.%Y %H:%M')}
    end
  end
end